// This Netlify serverless function generates AI tasks for plants

import { Configuration, OpenAIApi } from 'npm:openai@4.6.0';
import { createClient } from 'npm:@supabase/supabase-js@2.31.0';

// Headers for CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseKey || !openaiKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const configuration = new Configuration({ apiKey: openaiKey });
    const openai = new OpenAIApi(configuration);

    // Parse the request body
    const { userPlantId } = await req.json();

    if (!userPlantId) {
      return new Response(
        JSON.stringify({ error: 'userPlantId is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Get the user plant data
    const { data: userPlantData, error: userPlantError } = await supabase
      .from('user_plants')
      .select(`
        *,
        plants (*),
        garden_profiles (*)
      `)
      .eq('id', userPlantId)
      .single();

    if (userPlantError || !userPlantData) {
      return new Response(
        JSON.stringify({ error: userPlantError?.message || 'User plant not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const plant = userPlantData.plants;
    const garden = userPlantData.garden_profiles;
    const plantingDate = userPlantData.planting_date;
    const status = userPlantData.status;

    // Check for existing weather data
    const { data: alertsData } = await supabase
      .from('alerts')
      .select('event_type')
      .eq('garden_profile_id', garden.id)
      .eq('status', 'active');

    const weatherAlerts = alertsData?.map(a => a.event_type) || [];

    // Create prompt for OpenAI
    const prompt = `
      Generate a list of 3-5 specific care tasks for a ${plant.name} plant:
      
      Plant details:
      - Type: ${plant.type}
      - Planting date: ${plantingDate}
      - Current status: ${status}
      - Water needs: ${plant.water_needs}
      - Sun needs: ${plant.sun_needs}
      - Common issues: ${plant.common_issues.join(', ')}
      
      Garden details:
      - Location: ${garden.location}
      - Sunlight exposure: ${garden.sunlight}
      - Soil type: ${garden.soil_type}
      
      Current weather alerts: ${weatherAlerts.length > 0 ? weatherAlerts.join(', ') : 'None'}
      
      Please provide specific actionable tasks with estimated due dates (relative to current date, like "in 2 days" or "weekly"). Each task should be on a new line starting with "TASK:".
    `;

    // Call OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert gardening assistant helping to create garden care tasks. Be specific, practical, and knowledgeable about plant care."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.data.choices[0].message.content;
    const tasks = aiResponse
      .split('\n')
      .filter(line => line.startsWith('TASK:'))
      .map(task => task.replace('TASK:', '').trim());

    // Create tasks in the database
    const today = new Date();
    const taskInserts = tasks.map((taskDescription, index) => {
      // Parse relative dates like "in 2 days" or "weekly"
      let daysToAdd = 3 + index; // Default spacing
      
      if (taskDescription.includes('today')) {
        daysToAdd = 0;
      } else if (taskDescription.includes('tomorrow')) {
        daysToAdd = 1;
      } else if (taskDescription.match(/in \d+ days?/)) {
        const match = taskDescription.match(/in (\d+) days?/);
        if (match && match[1]) {
          daysToAdd = parseInt(match[1], 10);
        }
      } else if (taskDescription.includes('weekly') || taskDescription.includes('every week')) {
        daysToAdd = 7;
      } else if (taskDescription.includes('biweekly')) {
        daysToAdd = 14;
      } else if (taskDescription.includes('monthly')) {
        daysToAdd = 30;
      }
      
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + daysToAdd);
      
      return {
        user_plant_id: userPlantId,
        description: taskDescription,
        due_date: dueDate.toISOString().split('T')[0],
        status: 'pending',
        generated_by: 'ai'
      };
    });

    // Insert tasks into the database
    const { data: insertedTasks, error: insertError } = await supabase
      .from('tasks')
      .insert(taskInserts)
      .select();

    if (insertError) {
      return new Response(
        JSON.stringify({ error: insertError.message }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Return the created tasks
    return new Response(
      JSON.stringify({ 
        success: true, 
        tasks: insertedTasks,
        message: `Created ${insertedTasks.length} new tasks for your ${plant.name}`
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});