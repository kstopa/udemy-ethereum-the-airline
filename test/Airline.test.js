const Airline = artifacts.require('Airline');

let instance;

beforeEach( async () => {
    instance = await Airline.new()
});

contract('Airline', accounts => {

    it('Has flights defined', async() => {
        let totalFlights = await instance.getAirlineTotalFlights();
        assert(totalFlights > 0);
    });

    it('Should allow customers to buy a flight', async() => {
        let fId = 0;
        let flight = await instance.flights(fId);
        let flightName = flight[0], flightPrice = flight[1];
        //console.log(flight);
        /* Buy the flight */
        await instance.buyFlight(fId, {from: accounts[0], value: flightPrice});
        let customerFlight = await instance.customerFlights(accounts[0], 0);
        let customerTotalFlights = await instance.customerTotalFlights(accounts[0]);
        assert(customerFlight[0], flightName, "Bought flight different from listed");
        assert(customerFlight[1], flightPrice, "Bouught flight price different from listed");
        assert(customerTotalFlights, 1);

    });

    it('Should not allow customers to buy flight bellow the price', async() => {
        let fId = 1;
        let flight = await instance.flights(fId);
        let flightPrice = flight[1] - 5e5;
        try {
            await instance.buyFlight(fId, {from: accounts[0], value: flightPrice});
        } catch {
            return;
        }
        assert.fail()
    });

    it('Airline should have balance after purchase', async() => {
        // Buy some flights
        let fOneId = 0;
        let flightOne = await instance.flights(fOneId);
        let flightOnePrice = flightOne[1]
        let fTwoId = 1;
        let flightTwo = await instance.flights(fTwoId);
        let flightTwoPrice = flightTwo[1]
        await instance.buyFlight(fOneId, {from: accounts[1], value: flightOnePrice});
        await instance.buyFlight(fTwoId, {from: accounts[2], value: flightTwoPrice});
        // Check that balance is correct
        //let airlineBalance = instance.getAirlineBalance();
        //assert.equal(airlineBalance, flightOnePrice + flightTwoPrice, "Wrong airline balance");

    });

    if('Should allow redeem travel points', async() => {
        let fOneId = 1;
        let flightOne = await instance.flights(fOneId);
        let flightOnePrice = flightOne[1]

        await instance.buyFlight(fOneId, {from: accounts[1], value: flightOnePrice});
        let balance = await web3.eth.getBalance(accounts[1]);
        await instance.redeemLoyalityPoints({from: accounts[1]});
        let balanceFinal = await web3.eth.getBalance(accounts[1]);

        let customer = await instance.customers(accounts[1]);
        let loyaltyPoints = customer[0];

        assert(loyaltyPoints, 0, "Customer should not have loyalty points");
        assert(balanceFinal > balance, "Customer should have bigger balance after point redeem");


    });

})