const { getVisionSparkContext } = require('./knowledge.service');
const { getConversationMessages, saveMessage } = require('./memory.service');
const { enrollStudent, bookService } = require('./actions.service');

const COMPANY_PHONE = '+91 7815981081';

const toolsDefinition = [{
  functionDeclarations: [
    {
      name: "enrollStudent",
      description: "Enroll a student in a specific course when they explicitly say they want to join, register, or enroll, AND they provide their name and phone number. DO NOT call this if they are just asking for details.",
      parameters: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING", description: "Full name of the student" },
          phone: { type: "STRING", description: "Phone number of the student" },
          course_name: { type: "STRING", description: "Name of the course they want to enroll in" }
        },
        required: ["name", "phone", "course_name"]
      }
    },
    {
      name: "bookService",
      description: "Book a demo or meeting for an IT service when the user explicitly says they want to book or build something, AND they provide their name and phone number.",
      parameters: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING", description: "Full name of the client" },
          phone: { type: "STRING", description: "Phone number of the client" },
          service_name: { type: "STRING", description: "Name of the service they want to book" }
        },
        required: ["name", "phone", "service_name"]
      }
    }
  ]
}];

const orTools = [
  {
    type: "function",
    function: {
      name: "enrollStudent",
      description: "Enroll a student in a specific course when they explicitly say they want to join, register, or enroll, AND they provide their name and phone number. DO NOT call this if they are just asking for details.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Full name of the student" },
          phone: { type: "string", description: "Phone number of the student" },
          course_name: { type: "string", description: "Name of the course they want to enroll in" }
        },
        required: ["name", "phone", "course_name"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "bookService",
      description: "Book a demo or meeting for an IT service when the user explicitly says they want to book or build something, AND they provide their name and phone number.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Full name of the client" },
          phone: { type: "string", description: "Phone number of the client" },
          service_name: { type: "string", description: "Name of the service they want to book" }
        },
        required: ["name", "phone", "service_name"]
      }
    }
  }
];

async function generateChatResponse(conversationId, userQuery) {
  // 1. Save User Message
  await saveMessage(conversationId, 'user', userQuery);

  // 2. Fetch Knowledge Context
  const context = await getVisionSparkContext();

  // 3. Fetch Recent Messages
  const recentMessages = await getConversationMessages(conversationId, 12);
  let historyText = "";
  
  if (recentMessages.length > 1) { 
      historyText = "\\n\\nRECENT CONVERSATION HISTORY:\\n" + 
        recentMessages.slice(0, -1).map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\\n\\n');
  }

  // 4. Build System Prompt
  const systemPrompt = `You are Vision Spark AI, an intelligent enrollment counselor for Vision Spark Solutions India Pvt. Ltd.
Location: N M K D Complex, Jandrapeta, Chirala, Andhra Pradesh, India.
Phone: ${COMPANY_PHONE}

Vision Spark offers the following Live Courses:
${context.courses || 'All modern tech courses.'}

Our IT Services:
${context.services || 'Web, App, and Software Development.'}

Our Student Projects:
${context.projects || 'Real-world enterprise applications.'}
${historyText}

STRICT RULES:
1. ONLY answer questions related to Vision Spark's courses, services, projects, admissions, and company details.
2. PRICING: Always quote the exact prices listed in the course list above. These prices come directly from our website database.
3. If the user wants to enroll or book a service, ask for their NAME and PHONE NUMBER if they haven't provided them.
4. ONCE you have their name, phone, and course/service, CALL THE APPROPRIATE FUNCTION to save it to the database.
5. Keep answers under 3-4 short paragraphs.`;

  let replyText = null;

  // 5. Try Gemini API
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const contents = recentMessages.slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));
      
      contents.push({
        role: 'user',
        parts: [{ text: userQuery }]
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: contents,
            tools: toolsDefinition
          })
        }
      );
      
      if (response.ok) {
          const data = await response.json();
          if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            const parts = data.candidates[0].content.parts;
            
            // Check for Function Call
            const functionCallPart = parts.find(p => p.functionCall);
            if (functionCallPart) {
               const call = functionCallPart.functionCall;
               let actionResult = null;
               
               if (call.name === 'enrollStudent') {
                 actionResult = await enrollStudent(call.args);
               } else if (call.name === 'bookService') {
                 actionResult = await bookService(call.args);
               }

               if (actionResult) {
                 // Send result back to Gemini
                 const newContents = [...contents, {
                   role: 'model',
                   parts: [{ functionCall: call }]
                 }, {
                   role: 'user',
                   parts: [{
                     functionResponse: {
                       name: call.name,
                       response: actionResult
                     }
                   }]
                 }];
                 
                 const response2 = await fetch(
                  `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`,
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      system_instruction: { parts: [{ text: systemPrompt }] },
                      contents: newContents,
                      tools: toolsDefinition
                    })
                  }
                );
                const data2 = await response2.json();
                if (data2.candidates && data2.candidates[0].content && data2.candidates[0].content.parts) {
                   replyText = data2.candidates[0].content.parts.map(p => p.text).join('');
                }
               }
            } else {
               // Normal Text Response
               replyText = parts.map(p => p.text || '').join('');
            }
          }
      }
    } catch (e) { console.warn('Gemini failed:', e.message); }
  }

  // 5.5 Try OpenRouter Fallback
  const orKey = process.env.OPENROUTER_API_KEY;
  if (!replyText && orKey) {
    try {
      const messagesForOR = [
          { role: 'system', content: systemPrompt },
          ...recentMessages.slice(0, -1).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
          { role: 'user', content: userQuery }
      ];

      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${orKey}`,
          'HTTP-Referer': 'https://visionspark.in',
          'X-Title': 'Vision Spark AI Counselor'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: messagesForOR,
          max_tokens: 400,
          tools: orTools
        })
      });
      if (r.ok) {
        const d = await r.json();
        if (d.choices && d.choices[0].message) {
            const message = d.choices[0].message;
            if (message.tool_calls && message.tool_calls.length > 0) {
               const call = message.tool_calls[0].function;
               let args;
               try { args = JSON.parse(call.arguments); } catch(e) { args = {}; }
               let actionResult = null;

               if (call.name === 'enrollStudent') {
                 actionResult = await enrollStudent(args);
               } else if (call.name === 'bookService') {
                 actionResult = await bookService(args);
               }

               if (actionResult) {
                 const r2 = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                   method: 'POST',
                   headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `Bearer ${orKey}`,
                     'HTTP-Referer': 'https://visionspark.in',
                     'X-Title': 'Vision Spark AI Counselor'
                   },
                   body: JSON.stringify({
                     model: 'openai/gpt-4o-mini',
                     messages: [
                        ...messagesForOR, 
                        message, 
                        { role: 'tool', tool_call_id: message.tool_calls[0].id, name: call.name, content: JSON.stringify(actionResult) }
                     ],
                     max_tokens: 400,
                     tools: orTools
                   })
                 });
                 const d2 = await r2.json();
                 if (d2.choices && d2.choices[0].message) {
                    replyText = d2.choices[0].message.content.trim();
                 }
               }
            } else if (message.content) {
                let textContent = message.content.trim();
                
                // Fallback parser for Llama raw text tool calls (e.g., enrollStudent>{"name":...}</function>)
                const rawCallMatch = textContent.match(/([a-zA-Z]+)>(.*?})|<\/?function>/);
                if (rawCallMatch || textContent.includes('enrollStudent>') || textContent.includes('bookService>')) {
                    // Extract name and args manually
                    let funcName = textContent.includes('enrollStudent') ? 'enrollStudent' : 'bookService';
                    let argsMatch = textContent.match(/{(.*?)}/);
                    let args = {};
                    if (argsMatch) {
                        try { args = JSON.parse(argsMatch[0]); } catch(e) {}
                    }
                    
                    let actionResult = null;
                    if (funcName === 'enrollStudent' && args.name) actionResult = await enrollStudent(args);
                    else if (funcName === 'bookService' && args.name) actionResult = await bookService(args);

                    if (actionResult) {
                        textContent = actionResult.message;
                    }
                }

                replyText = textContent;
            }
        }
      }
    } catch (e) { console.warn('OpenRouter failed:', e.message); }
  }

  // 6. Ultimate Fallback (No APIs or Error)
  if (!replyText) {
      replyText = generateSmartFallback(userQuery.toLowerCase(), context);
  }

  // 7. Save Assistant Response
  if (replyText) {
      await saveMessage(conversationId, 'assistant', replyText);
  }

  return replyText;
}

function generateSmartFallback(query, context) {
  if (['hi','hello','hey','hii'].some(g => query.startsWith(g))) {
    return `👋 Hello! Welcome to Vision Spark AI.\n\nI am the enrollment counselor. I can help you with details about our **Courses**, **Services**, and **Admissions**.\n\nHow can I help you today?`;
  }
  if (query.includes('course') || query.includes('learn') || query.includes('training')) {
    return `🎯 We offer several industry-focused programs (Online ₹2,999 / Offline ₹9,999):\n\n${context.courses.split('\\n').slice(0,5).join('\\n')}\n\nPlease let me know which technology you want to learn, or check the Courses page!`;
  }
  if (query.includes('fee') || query.includes('price') || query.includes('cost')) {
    return `⚡ **Pricing:** Please check our website or ask about a specific course, and I will check the latest price for you!\n\nCall us to enroll: **${COMPANY_PHONE}**`;
  }
  return `🤖 **Vision Spark AI**\n\nI am specifically trained to answer questions about Vision Spark Solutions' courses, services, and admissions. Please contact **${COMPANY_PHONE}** for more details!`;
}

module.exports = {
  generateChatResponse
};
