const fetchEndpoint = async (loc, method) => {
    try {
        const res = await fetch(loc);
        return await res[method]();
    } catch (e) {
        console.log(e);
    }
};

const net = {
    fetchEndpoint: fetchEndpoint
};

export default net;