const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Variáveis de ambiente SUPABASE_URL e SUPABASE_KEY não configuradas');
  // Em vez de throw, vamos exportar null para que as funções possam lidar com isso
  module.exports = { supabase: null };
} else {
  const supabase = createClient(supabaseUrl, supabaseKey);
  module.exports = { supabase };
}
