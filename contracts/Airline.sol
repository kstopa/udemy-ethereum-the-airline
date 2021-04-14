// SPDX-License-Identifier: GPLv3
pragma solidity > 0.7.0 <= 0.9.0;

import "./Ownable.sol";

contract Airline is Ownable {

    struct Customer {
        uint loyaltyPoints;
        uint totalFlights;
    }

    struct Flight {
        string name;
        uint price;     // uint == uint256
    }

    Flight[] public flights;

    uint etherPerPoint = 0.25 ether;

    mapping(address => Customer) public customers;
    mapping(address => Flight[]) public customerFlights;
    mapping(address => uint) public customerTotalFlights;
    
    event FlightPurchased(address indexed customer, uint price);

    /* Constructor that calls super constructor */
    constructor() Ownable() {
        flights.push(Flight('Tokio', 4 ether));
        flights.push(Flight('Warsaw', 5 ether));
        flights.push(Flight('Madrid', 3 ether));
    }

    function buyFlight(uint flightIndex) public payable {
        require(flightIndex < flights.length, "Flight does not exists");
        Flight memory flight = flights[flightIndex];
        require(flight.price == msg.value, "Wrong flight payment ammount");
        /* Use storeage as changes will be stored */
        Customer storage customer = customers[msg.sender];
        customer.loyaltyPoints += 5;
        customer.totalFlights += 1;
        // Add to customers flights
        customerFlights[msg.sender].push(flight);
        customerTotalFlights[msg.sender] ++;

        emit FlightPurchased(msg.sender, flight.price);
    }

    function getAirlineTotalFlights() public view returns (uint) {
        return flights.length;
    }

    function redeemLoyaltyPoints(address payable addr) public {
        require(addr == msg.sender, "You can reddem only for your account");
        Customer storage customer = customers[msg.sender];
        uint ethersToRefund = customer.loyaltyPoints * etherPerPoint;
        addr.transfer(ethersToRefund);
        customer.loyaltyPoints = 0;
    }

    function getRefundableEther() public view returns (uint) {
        Customer storage customer = customers[msg.sender];
        return customer.loyaltyPoints * etherPerPoint;
    }

    function getAirlineBalance() public isOwner view returns (uint) {
        address airlineAddr = address(this);
        return airlineAddr.balance;
    }

}