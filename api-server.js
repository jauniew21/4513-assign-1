const express = require('express'); 
const supa = require('@supabase/supabase-js'); 
const app = express(); 
require('dotenv').config();
 
const supaUrl = process.env.DATABASE_URL;
const supaAnonKey = process.env.API_KEY;
const supabase = supa.createClient(supaUrl, supaAnonKey);

app.get('/api/circuits', async (req, res) => { 
    const {data, error} = await supabase 
    .from('circuits') 
    .select(); 
    res.send(data); 
});

app.get('/api/circuits/:ref', async (req, res) => { 
    const {data, error} = await supabase 
    .from('circuits') 
    .select()
    .eq('circuitRef',req.params.ref);
    res.send(data); 
});

app.get('/api/circuits/season/:year', async (req, res) => { 
    const {data, error} = await supabase 
    .from('races') 
    .select(``)
    .eq('year',req.params.year)
    .order('round', {ascending: true});
    res.send(data); 
});

app.get('/api/constructors', async (req, res) => { 
    const {data, error} = await supabase 
    .from('constructors') 
    .select(); 
    res.send(data); 
});

app.get('/api/constructors/:ref', async (req, res) => { 
    const {data, error} = await supabase 
    .from('constructors') 
    .select()
    .eq('constructorRef',req.params.ref);
    res.send(data); 
});

app.get('/api/drivers', async (req, res) => { 
    const {data, error} = await supabase 
    .from('drivers') 
    .select(); 
    res.send(data); 
});

app.get('/api/drivers/:ref', async (req, res) => { 
    ref = req.params.ref.toLowerCase();
    const {data, error} = await supabase 
    .from('drivers') 
    .select()
    .eq('driverRef', ref);
    res.send(data); 
});

app.get('/api/drivers/search/:substring', async (req, res) => { 
    const {data, error} = await supabase 
    .from('drivers') 
    .select()
    .ilike('surname', req.params.substring + '%') 
    res.send(data); 
});

app.get('/api/drivers/race/:raceId', async (req, res) => { 
    const {data, error} = await supabase 
    .from('races') 
    .select(`results (drivers (driverRef, number, code, forename, surname, dob, nationality, url))`)
    .eq('raceId', req.params.raceId);
    res.send(data); 
});

app.get('/api/races/:raceId', async (req, res) => { 
    const {data, error} = await supabase 
    .from('races') 
    .select(`raceId, year, round, circuitId, name, 
        date, time, url, circuits (name, location, country)`)
    .eq('raceId', req.params.raceId);
    res.send(data); 
});

app.get('/api/races/season/:year', async (req, res) => { 
    const {data, error} = await supabase 
    .from('races') 
    .select(``)
    .eq('year',req.params.year)
    .order('round', {ascending: true});
    res.send(data); 
});

app.get('/api/races/season/:year/:round', async (req, res) => { 
    const {data, error} = await supabase 
    .from('races') 
    .select(``)
    .eq('year',req.params.year)
    .eq('round',req.params.round)
    .order('round', {ascending: true});
    res.send(data); 
});

// test cases expect ID not ref
app.get('/api/races/circuits/:ref', async (req, res) => { 
    const {data, error} = await supabase 
    .from('races') 
    .select(``)
    .eq('circuitId',req.params.ref)
    .order('year', {ascending: true});
    res.send(data); 
});

app.get('/api/races/circuits/:ref/season/:start/:end', async (req, res) => { 
    const {data, error} = await supabase 
    .from('races') 
    .select(``)
    .eq('circuitId',req.params.ref)
    .gte('year',req.params.start) 
    .lte('year',req.params.end)
    .order('year', {ascending: true});
    res.send(data); 
});

app.get('/api/results/:raceId', async (req, res) => { 
    const {data, error} = await supabase 
    .from('results') 
    .select(`drivers (driverRef, code, forename, surname),
        races (name, round, year, date), 
        constructors (name, constructorRef, nationality)`)
    .eq('raceId', req.params.raceId)
    .order('grid', {ascending: true})
    res.send(data); 
});

app.get('/api/results/driver/:ref', async (req, res) => { 
    ref = req.params.ref.toLowerCase();
    const {data, error} = await supabase 
    .from('drivers') 
    .select(`results (drivers (driverRef, code, forename, surname),
        races (name, round, year, date), 
        constructors (name, constructorRef, nationality))`)
    .eq('driverRef', ref)
    res.send(data); 
});

// two years? FIX
app.get('/api/results/drivers/:ref/seasons/:start/:end', async (req, res) => { 
    ref = req.params.ref.toLowerCase();
    const {data, error} = await supabase 
    .from('drivers') 
    .select(`results (drivers (driverRef, code, forename, surname),
        races (name, round, year, date), 
        constructors (name, constructorRef, nationality))`)
    .eq('driverRef', ref)
    .gte('results (races (year))',req.params.start) 
    .lte('results (races (year))',req.params.end)
    res.send(data); 
});

app.get('/api/qualifying/:raceId', async (req, res) => { 
    const {data, error} = await supabase 
    .from('qualifying') 
    .select(`drivers (driverRef, code, forename, surname),
        races (name, round, year, date), 
        constructors (name, constructorRef, nationality)`)
    .eq('raceId', req.params.raceId);
    res.send(data); 
});

app.get('/api/standings/drivers/:raceId', async (req, res) => { 
    const {data, error} = await supabase 
    .from('qualifying') 
    .select(`position, drivers (driverRef, code, forename, surname),
        races (name, round, year, date), 
        constructors (name, constructorRef, nationality)`)
    .eq('raceId', req.params.raceId)
    .order('position', {ascending: true});
    res.send(data); 
});

// constructor order?

const port = process.env.PORT;
app.listen(port, () => { 
    console.log('listening on port 8080');
    console.log("http://localhost:8080/api/circuits")
    console.log("http://localhost:8080/api/circuits/monza")
    console.log("http://localhost:8080/api/circuits/calgary")
    console.log("http://localhost:8080/api/constructors")
    console.log("http://localhost:8080/api/constructors/ferrari")
    console.log("http://localhost:8080/api/drivers")
    console.log("http://localhost:8080/api/drivers/Norris")
    console.log("http://localhost:8080/api/drivers/norris")
    console.log("http://localhost:8080/api/drivers/connolly")
    console.log("http://localhost:8080/api/drivers/search/sch")
    console.log("http://localhost:8080/api/drivers/search/xxxxx")
    console.log("http://localhost:8080/api/drivers/race/10")
    console.log("http://localhost:8080/api/races/10")
    console.log("http://localhost:8080/api/races/season/2021")
    console.log("http://localhost:8080/api/races/season/1800")
    console.log("http://localhost:8080/api/races/season/2020/5")
    console.log("http://localhost:8080/api/races/season/2020/100")
    console.log("http://localhost:8080/api/races/circuits/7")
    console.log("http://localhost:8080/api/races/circuits/7/season/2015/2022")
    console.log("http://localhost:8080/api/races/circuits/7/season/2022/2022")
    console.log("http://localhost:8080/api/results/11")
    console.log("http://localhost:8080/api/results/driver/hamilton")
    console.log("http://localhost:8080/api/results/driver/connolly")
    console.log("http://localhost:8080/api/results/drivers/sainz/seasons/2021/2022")
    console.log("http://localhost:8080/api/results/drivers/sainz/seasons/2035/2022")
    console.log("http://localhost:8080/api/qualifying/1106")
    console.log("http://localhost:8080/api/standings/drivers/1120")
    console.log("http://localhost:8080/api/standings/constructors/1120")
    console.log("http://localhost:8080/api/standings/constructors/asds")
});