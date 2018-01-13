const fetchEndpoint = async (loc, method) => {
    return `Timestamp,Date,Location,Category,Spent,Received,Budget,Purchased By,Item For
        12/9/2017 9:09:41,"Dec 9, 2017",Tully’s,Out to Eat,5.99,0.00,0.00,Anna,Anna
        12/9/2017 14:15:59,"Dec 9, 2017",Amazon Fresh,Groceries,72.55,0.00,0.00,Tyler,Tyler`;
};

const net = {
    fetchEndpoint: fetchEndpoint
};

export default net;