const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile')

let accounts;
let inbox;
let INITIAL_STRING = "Hi there!";

beforeEach(async () => {
    // Get a list of all accounts

    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy 
    // the contract
    
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, 
            arguments: [INITIAL_STRING] })
        .send({ from: accounts[0], gas: '1000000'});

})

describe('Inbox', () => {
    it('deploys a contact', () => {
        assert.ok(inbox.options.address);
    })
    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    })
    it('can change the message', async () => {
        let NEW_MESSAGE = 'The new message!';
        await inbox.methods.setMessage(NEW_MESSAGE).send({from: accounts[0]});
        const newMessage = await inbox.methods.message().call();
        assert.equal(newMessage, NEW_MESSAGE);
    })
})



// class Car {

//     park() {
//         return 'stopped';
//     }

//     drive() {
//         return 'vroom';
//     }
// }

// let car;

// beforeEach(() => {
//     car = new Car();
// })

// describe('Car', () => {
//     it('can park', () => {
//         assert.equal(car.park(), 'stopped');
//     })

//     it('can drive', () => {
//         assert.equal(car.drive(), 'vroom');
//     })
// })