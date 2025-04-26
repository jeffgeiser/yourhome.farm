// This Netlify serverless function fetches weather data and creates alerts

import { createClient } from '@supabase/supabase-js';

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
    const openweathermapKey = Deno.env.get('OPENWEATHERMAP_API_KEY');

    if (!supabaseUrl || !supabaseKey || !openweathermapKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all gardens with active profiles
    const { data: gardens, error: gardensError } = await supabase
      .from('garden_profiles')
      .select('id, location');

    if (gardensError) {
      throw gardensError;
    }

    const results = [];

    // Process each garden's location
    for (const garden of gardens) {
      try {
        const location = garden.location;
        
        // Skip if no location provided
        if (!location) continue;

        // Call weather API
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=imperial&appid=${openweathermapKey}`
        );

        if (!response.ok) {
          console.error(`Error fetching weather for ${location}: ${response.statusText}`);
          continue;
        }

        const weatherData = await response.json();
        const tempF = weatherData.main.temp;
        const weatherCondition = weatherData.weather[0].main.toLowerCase();
        const windSpeed = weatherData.wind.speed;

        // Determine if any alerts are needed
        let alertType = null;
        if (tempF <= 32) {
          alertType = 'Frost';
        } else if (tempF >= 90) {
          alertType = 'Heat Wave';
        }

        // Check for wind alerts
        if (windSpeed > 20) {
          // If there's already an alert, this will be an additional one
          if (!alertType) {
            alertType = 'High Winds';
          } else {
            // Add an additional wind alert
            await createAlert(supabase, garden.id, 'High Winds');
            results.push({
              garden: garden.id,
              location,
              alert: 'High Winds',
              windSpeed
            });
          }
        }

        // Create alert if needed
        if (alertType) {
          await createAlert(supabase, garden.id, alertType);
          results.push({
            garden: garden.id,
            location,
            alert: alertType,
            temperature: tempF
          });
        }
      } catch (error) {
        console.error(`Error processing garden ${garden.id}: ${error.message}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        processed: gardens.length,
        alertsCreated: results.length
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

// Helper function to create an alert
async function createAlert(supabase, gardenId, eventType) {
  const today = new Date().toISOString().split('T')[0];
  
  // Check if an active alert already exists for this garden and event type today
  const { data: existingAlerts } = await supabase
    .from('alerts')
    .select('id')
    .eq('garden_profile_id', gardenId)
    .eq('event_type', eventType)
    .eq('event_date', today)
    .eq('status', 'active');

  // If no existing alert, create one
  if (!existingAlerts || existingAlerts.length === 0) {
    return supabase
      .from('alerts')
      .insert({
        garden_profile_id: gardenId,
        event_type: eventType,
        event_date: today,
        status: 'active'
      });
  }
  
  return { data: existingAlerts[0] };
}