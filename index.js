
const express = require('express');
const app = express();
app.use(express.static('shraddhaassignment3/dist/shraddhaassignment3/browser'))
const port= process.env.Port || 8080;
const axios = require('axios')
const cors = require('cors')
const bodyparser = require('body-parser');
const { MongoClient, ObjectId} = require('mongodb');
const encodedPassword = encodeURIComponent('ABC');
const uri = `mongodb+srv://shraddhajainak:${encodedPassword}@shraddhacluster0.segyqg0.mongodb.net/?retryWrites=true&w=majority&appName=shraddhacluster0`;

const client = new MongoClient(uri);




app.use(express.json());
app.use(cors());
app.use(bodyparser.json());


app.get('/', (req, res) => {
    
});

app.get('/watchlist', async (req, res) => {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        const database = client.db('assignment3');
        const collection = database.collection('watchlist');
        const data = await collection.find({}).toArray();
       // await collection.deleteOne({ _id: insertionid });
        await client.close();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/addtowatchlist', async(req, res) => {
    const name = req.query.name;
    const ticker = req.query.ticker;
    const c = req.query.c;
    const d = req.query.d;
    const dp = req.query.dp;
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        const database = client.db('assignment3');
        const collection = database.collection('watchlist');
        const result = await collection.insertOne({
            name: name,
            ticker: ticker,
            c: c,
            d: d,
            dp:dp
        });
        await client.close();
        res.json({ success: true, message: 'Data added to watchlist successfully', insertedId: result.insertedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/deletewatchlist/:ticker', async (req, res) =>{
    ticker = req.params.ticker;
    try {
        await client.connect();
        const database = client.db('assignment3');
        const collection = database.collection('watchlist');
        //const objectid = new ObjectId(insertionid);
        await collection.deleteMany({ ticker:ticker});
        await client.close();
        res.status(200).json({ success: true, message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error removing item from watchlist:', error);
        res.status(500).send('Internal Server Error');
    }

});

app.get('/checkwatchlist/:ticker', async (req, res) =>{
    ticker = req.params.ticker;
    try {
        await client.connect();
        const database = client.db('assignment3');
        const collection = database.collection('watchlist');
        const inwatchlist = await collection.findOne({ ticker:ticker});
        if (inwatchlist) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
        await client.close();
       
    } catch (error) {
        console.error('Error removing item from watchlist:', error);
        res.status(500).send('Internal Server Error');
    }

});

app.get('/walletamount', async (req, res) => {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        const database = client.db('assignment3');
        const collection = database.collection('walletamount');
        const result = await collection.findOne({});
        await client.close();
        res.json({ walletamount: result.walletamount });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/buywalletupdate', async (req, res) => {
    const  total  = parseFloat(req.query.total);
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        const database = client.db('assignment3');
        const collection = database.collection('walletamount');
        const result = await collection.findOne({});
        const currentwalletamount = parseFloat(result.walletamount.toString());
        await collection.updateOne({}, { $set: { walletamount: currentwalletamount - total } });
        await client.close();
        res.json({ success: true, message: 'Wallet amount updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/sellwalletupdate', async (req, res) => {
    const  total  = parseFloat(req.query.total);
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        const database = client.db('assignment3');
        const collection = database.collection('walletamount');
        const result = await collection.findOne({});
        const currentwalletamount = parseFloat(result.walletamount.toString());
        await collection.updateOne({}, { $set: { walletamount: currentwalletamount + total } });
        await client.close();
        res.json({ success: true, message: 'Wallet amount updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/buysellstocks', async (req, res) => {
    const ticker = req.query.ticker;
    const newquantity = parseInt(req.query.newquantity); 
    const newtotal = parseFloat(req.query.newtotal);
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        const database = client.db('assignment3');
        const collection = database.collection('buysell');
        
        const tickerexist = await collection.findOne({ ticker: ticker });
        if (!tickerexist) {
            await collection.insertOne({ ticker: ticker, quantity: newquantity, total:newtotal });
          } else {
            
            await collection.updateOne({ _id: tickerexist._id }, { $set: { quantity: tickerexist.quantity + newquantity, total:tickerexist.total + newtotal } });
          }
        await client.close();
        res.status(200).json({ success: true, message: 'Stocks updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.get('/checkstockquantity', async (req, res) =>{
    const ticker = req.query.ticker;
    try {
        await client.connect();
        const database = client.db('assignment3');
        const collection = database.collection('buysell');
        const tickerincollection = await collection.findOne({ ticker:ticker});
        if (!tickerincollection) {
            return res.status(404).json({ error: 'Stock not found' });
        } 
        res.json({ quantity: tickerincollection.quantity });
        await client.close();
       
    } catch (error) {
        console.error('Error removing item from watchlist:', error);
        res.status(500).send('Internal Server Error');
    }

});

app.get('/sellstocks', async (req, res) => {
    const ticker = req.query.ticker;
    const newquantity = parseInt(req.query.newquantity); 
    const newtotal = parseFloat(req.query.newtotal);
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        const database = client.db('assignment3');
        const collection = database.collection('buysell');
        const tickerexist = await collection.findOne({ ticker: ticker }); 
        const updatedquantity = tickerexist.quantity - newquantity;
        const updatedtotal = tickerexist.total - newtotal;           
        await collection.updateOne({ _id: tickerexist._id }, { $set: { quantity: updatedquantity, total:updatedtotal } });
        if (updatedquantity <= 0) {
            await collection.deleteOne({ ticker: ticker });
            console.log('Stock removed from collection');
        }
        await client.close();
        res.status(200).json({ success: true, message: 'Stocks updated successfully' });
    } catch (error) {
        console.error(error);

        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.get('/stocksforportfolio', async (req, res) => {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        const database = client.db('assignment3');
        const collection = database.collection('buysell');
        const data = await collection.find({}).toArray();
       // await collection.deleteOne({ _id: insertionid });
        await client.close();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/checkinbuysell/:ticker', async (req, res) =>{
    const ticker = req.params.ticker;
    try {
        await client.connect();
        const database = client.db('assignment3');
        const collection = database.collection('buysell');
        const inbuysell = await collection.findOne({ ticker:ticker});
        if (inbuysell) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
        await client.close();
       
    } catch (error) {
        console.error('Error checking buysell:', error);
        res.status(500).send('Internal Server Error');
    }

});


app.get('/autocomplete', async (req, res) => {
    try {
        const query = req.query.q;
        const apiUrl = `https://finnhub.io/api/v1/search?q=${query}&token=cnnv8`;
        const response = await axios.get(apiUrl);
        //const autocompleteData = response.data.filter(item => item.type === 'Common Stock' && !item.symbol.includes('.'));
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/companydetailsone', async (req, res) => {
    try {
        const query = req.query.q;
        const apiUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${query}&token=cnnv8`;
        const response = await axios.get(apiUrl);
        //const autocompleteData = response.data.filter(item => item.type === 'Common Stock' && !item.symbol.includes('.'));
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/companydetailstwo', async (req, res) => {
    try {
        const query = req.query.q;
        const apiUrl = `https://finnhub.io/api/v1/quote?symbol=${query}&token=cnnv8`;
        const response = await axios.get(apiUrl);
        //const autocompleteData = response.data.filter(item => item.type === 'Common Stock' && !item.symbol.includes('.'));
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/companypeers', async (req, res) => {
    try {
        const query = req.query.q;
        const apiUrl = `https://finnhub.io/api/v1/stock/peers?symbol=${query}&token=cnnv8`;
        const response = await axios.get(apiUrl);
        //const autocompleteData = response.data.filter(item => item.type === 'Common Stock' && !item.symbol.includes('.'));
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/hourchart', async (req, res) => {
    try {
        const query = req.query.q;
        const timestamp = parseInt(req.query.timestamp);
        const currentTimestamp = (Date.now())-(7*60*60*1000);
        const difference = currentTimestamp - (timestamp * 1000);
        let fromdate, todate;

        if (difference < 60 * 1000) {
            const today = (Date.now())-(7*60*60*1000);
            const yesterday = today - (24*60*60*1000);
            fromdate = yesterday;
            todate = today;
            console.log('Market is open');
        } else { 
            const timeclosed = timestamp * 1000;
            const daybefore = timeclosed -(24*60*60*1000);
            fromdate = daybefore;
            todate = timeclosed;
            console.log('Market is closed');
        }
        console.log('fromdate', fromdate);
        console.log('todate', todate);

        const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${query}/range/1/hour/${fromdate}/${todate}?adjusted=true&sort=asc&limit=120&apiKey=GtDAGN5`;
        console.log('API URL:', apiUrl); 
        const response = await axios.get(apiUrl);
        res.json(response.data);


        
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/charttab', async (req, res) => {
    try {
        const query = req.query.q;
        const today = (Date.now())-(7*60*60*1000);
        console.log(new Date(today));
        const twoyears = new Date(today);
        twoyears.setFullYear(twoyears.getFullYear() - 2);
        
        let fromdate, todate;
        fromdate = twoyears.getTime();
        console.log('twoyearsago',new Date(fromdate))
        todate = today;
        const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${query}/range/1/day/${fromdate}/${todate}?adjusted=true&sort=asc&limit=120&apiKey=_M_5pzU5MgDL_3`;
        const response = await axios.get(apiUrl);
        console.log('API URL:', apiUrl); 
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/insighttab', async (req, res) => {
    try {
        const query = req.query.q;
        const apiUrl = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${query}&token=co0t1tpr01`;
        const response = await axios.get(apiUrl);
        //const autocompleteData = response.data.filter(item => item.type === 'Common Stock' && !item.symbol.includes('.'));
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/insighttrends', async (req, res) => {
    try {
        const query = req.query.q;
        const apiUrl = ` https://finnhub.io/api/v1/stock/recommendation?symbol=${query}&token=co0t1tpr01`;
        const response = await axios.get(apiUrl);
        //const autocompleteData = response.data.filter(item => item.type === 'Common Stock' && !item.symbol.includes('.'));
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/insighteps', async (req, res) => {
    try {
        const query = req.query.q;
        const apiUrl = `https://finnhub.io/api/v1/stock/earnings?symbol=${query}&token=co0t1tpr01`;
        const response = await axios.get(apiUrl);
        let notnull = response.data;
        notnull = notnull.map(item=>{
            for(const key in item){
                if(item[key]===null){
                    item[key] = 0;
                }
            }
            return item;
        });
        res.json(notnull);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/newstab', async (req, res) => {
    try {
        const query = req.query.q;
        const thistime = (Date.now())-(7*60*60*1000);
        const thisday = new Date(thistime);
        const todate = thisday.toISOString().split('T')[0];
        console.log(todate)
        thisday.setDate(thisday.getDate() - 7);
        const fromdate = thisday.toISOString().split('T')[0];
        console.log(fromdate)

        const apiUrl = `https://finnhub.io/api/v1/company-news?symbol=${query}&from=${fromdate}&to=${todate}&token=co0t1tpr01`;
        const response = await axios.get(apiUrl);
       
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  
