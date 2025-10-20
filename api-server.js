const express = require('express'); 
const supa = require('@supabase/supabase-js'); 
const app = express(); 
require('dotenv').config();
 
const supaUrl = process.env.DATABASE_URL;
const supaAnonKey = process.env.API_KEY;
const supabase = supa.createClient(supaUrl, supaAnonKey);

const jsonMessage = (msg) => { 
    return { message : msg }; 
};

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

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${req.params.ref}.`));
    }

    res.send(data); 
});

app.get('/api/circuits/season/:year', async (req, res) => { 
    const {data, error} = await supabase 
    .from('races') 
    .select(``)
    .eq('year',req.params.year)
    .order('round', {ascending: true});

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${req.params.year}.`));
    }

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

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${req.params.ref}.`));
    }

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

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${ref}.`));
    }

    res.send(data); 
});

app.get('/api/drivers/search/:substring', async (req, res) => { 
    const {data, error} = await supabase 
    .from('drivers') 
    .select()
    .ilike('surname', req.params.substring + '%');

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${req.params.substring}.`));
    }

    res.send(data); 
});

app.get('/api/drivers/race/:raceId', async (req, res) => { 
    const {data, error} = await supabase 
    .from('races') 
    .select(`results (drivers (driverRef, number, code, forename, surname, dob, nationality, url))`)
    .eq('raceId', req.params.raceId);

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${req.params.raceId}.`));
    }

    res.send(data); 
});

app.get('/api/races/:raceId', async (req, res) => { 
    const {data, error} = await supabase 
    .from('races') 
    .select(`raceId, year, round, circuitId, name, 
        date, time, url, circuits (name, location, country)`)
    .eq('raceId', req.params.raceId);

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${req.params.raceId}.`));
    }

    res.send(data); 
});

app.get('/api/races/season/:year', async (req, res) => { 
    const {data, error} = await supabase 
    .from('races') 
    .select(``)
    .eq('year',req.params.year)
    .order('round', {ascending: true});

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${req.params.year}.`));
    }

    res.send(data); 
});

app.get('/api/races/season/:year/:round', async (req, res) => { 
    const {data, error} = await supabase 
    .from('races') 
    .select(``)
    .eq('year',req.params.year)
    .eq('round',req.params.round)
    .order('round', {ascending: true});

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${req.params.year} and ${req.params.round}.`));
    }

    res.send(data); 
});

// test cases expect ID not ref
app.get('/api/races/circuits/:ref', async (req, res) => { 
    const {data, error} = await supabase 
    .from('races') 
    .select(``)
    .eq('circuitId',req.params.ref)
    .order('year', {ascending: true});

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${req.params.ref}.`));
    }

    res.send(data); 
});

// still funky
app.get('/api/races/circuits/:ref/season/:start/:end', async (req, res) => { 
    if (req.params.end < req.params.start) {
      return res.json(jsonMessage(`end year cannot be before start year.`));
    }

    const {data, error} = await supabase 
    .from('races') 
    .select(``)
    .eq('circuitId',req.params.ref)
    .gte('year',req.params.start) 
    .lte('year',req.params.end)
    .order('year', {ascending: true});

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${req.params.ref}.`));
    }

    res.send(data); 
});

app.get('/api/results/:raceId', async (req, res) => { 
    const {data, error} = await supabase 
    .from('results') 
    .select(`drivers (driverRef, code, forename, surname),
        races (name, round, year, date), 
        constructors (name, constructorRef, nationality)`)
    .eq('raceId', req.params.raceId)
    .order('grid', {ascending: true});

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${req.params.raceId}.`));
    }

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

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${req.params.ref}.`));
    }

    res.send(data); 
});

// still funky
app.get('/api/results/drivers/:ref/seasons/:start/:end', async (req, res) => { 
    if (req.params.end+2 > req.params.start) {
      return res.json(jsonMessage(`two years is the maximum searchable range.`));
    }
    
    if (req.params.end < req.params.start) {
      return res.json(jsonMessage(`end year cannot be before start year.`));
    }

    ref = req.params.ref.toLowerCase();
    const {data, error} = await supabase 
    .from('drivers') 
    .select(`results (drivers (driverRef, code, forename, surname),
        races (name, round, year, date), 
        constructors (name, constructorRef, nationality))`)
    .eq('driverRef', ref)
    .gte('results (races (year))',req.params.start) 
    .lte('results (races (year))',req.params.end);

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${req.params.ref}.`));
    }

    res.send(data) 
});

app.get('/api/qualifying/:raceId', async (req, res) => { 
    const {data, error} = await supabase 
    .from('qualifying') 
    .select(`drivers (driverRef, code, forename, surname),
        races (name, round, year, date), 
        constructors (name, constructorRef, nationality)`)
    .eq('raceId', req.params.raceId);

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${req.params.raceId}.`));
    }

    res.send(data)
});

app.get('/api/standings/drivers/:raceId', async (req, res) => { 
    const {data, error} = await supabase 
    .from('qualifying') 
    .select(`position, drivers (driverRef, code, forename, surname),
        races (name, round, year, date), 
        constructors (name, constructorRef, nationality)`)
    .eq('raceId', req.params.raceId)
    .order('position', {ascending: true});

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${req.params.raceId}.`));
    }

    res.send(data)
});

// constructor order?
app.get('/api/standings/constructors/:raceId', async (req, res) => { 
    const {data, error} = await supabase 
    .from('qualifying') 
    .select(`position, drivers (driverRef, code, forename, surname),
        races (name, round, year, date), 
        constructors (name, constructorRef, nationality)`)
    .eq('raceId', req.params.raceId)
    .order('position', {ascending: true});

    if (!data || data.length === 0) {
        return res.json(jsonMessage( `No data found for ${req.params.raceId}.`));
    }

    res.send(data)
});

const port = process.env.PORT;
app.listen(port, () => { 
    console.log('listening on port ' + port);
    console.log("https://four513-assign-1.onrender.com/api/circuits")
    console.log("https://four513-assign-1.onrender.com/api/circuits/monza")
    console.log("https://four513-assign-1.onrender.com/api/circuits/calgary")
    console.log("https://four513-assign-1.onrender.com/api/constructors")
    console.log("https://four513-assign-1.onrender.com/api/constructors/ferrari")
    console.log("https://four513-assign-1.onrender.com/api/drivers")
    console.log("https://four513-assign-1.onrender.com/api/drivers/Norris")
    console.log("https://four513-assign-1.onrender.com/api/drivers/norris")
    console.log("https://four513-assign-1.onrender.com/api/drivers/connolly")
    console.log("https://four513-assign-1.onrender.com/api/drivers/search/sch")
    console.log("https://four513-assign-1.onrender.com/api/drivers/search/xxxxx")
    console.log("https://four513-assign-1.onrender.com/api/drivers/race/10")
    console.log("https://four513-assign-1.onrender.com/api/races/10")
    console.log("https://four513-assign-1.onrender.com/api/races/season/2021")
    console.log("https://four513-assign-1.onrender.com/api/races/season/1800")
    console.log("https://four513-assign-1.onrender.com/api/races/season/2020/5")
    console.log("https://four513-assign-1.onrender.com/api/races/season/2020/100")
    console.log("https://four513-assign-1.onrender.com/api/races/circuits/7")
    console.log("https://four513-assign-1.onrender.com/api/races/circuits/7/season/2015/2022")
    console.log("https://four513-assign-1.onrender.com/api/races/circuits/7/season/2022/2022")
    console.log("https://four513-assign-1.onrender.com/api/results/11")
    console.log("https://four513-assign-1.onrender.com/api/results/driver/hamilton")
    console.log("https://four513-assign-1.onrender.com/api/results/driver/connolly")
    console.log("https://four513-assign-1.onrender.com/api/results/drivers/sainz/seasons/2021/2022")
    console.log("https://four513-assign-1.onrender.com/api/results/drivers/sainz/seasons/2035/2022")
    console.log("https://four513-assign-1.onrender.com/api/qualifying/1106")
    console.log("https://four513-assign-1.onrender.com/api/standings/drivers/1120")
    console.log("https://four513-assign-1.onrender.com/api/standings/constructors/1120")
    console.log("https://four513-assign-1.onrender.com/api/standings/constructors/asds")
});