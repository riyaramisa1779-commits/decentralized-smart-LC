// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;


// ADMIN BASE

contract Adminable {
    address public admin;

    constructor(address _admin) {
        admin = _admin;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
}


// USER REGISTRATION MODULE

contract UserRegistration {
    struct User {
        string name;
        string role; // importer/exporter/bank
        bool verified;
        address wallet;
    }

    mapping(address => User) public users;

    function registerUser(string memory _name, string memory _role) internal {
        users[msg.sender] = User(_name, _role, false, msg.sender);
    }

    function getUser(address _user) public view returns (User memory) {
        return users[_user];
    }
}


// KYC VERIFICATION MODULE

contract KYCVerification is UserRegistration {
    function _verifyUser(address _user) internal {
        users[_user].verified = true;
    }
}


// DEAL MANAGEMENT MODULE

contract DealManagement {
    struct Deal {
        uint id;
        address importer;
        address exporter;
        string goodsDescription;
        uint amount;
        string documentHash;
        bool approved;
        bool deliveryVerified;
    }

    uint public dealCount;
    mapping(uint => Deal) public deals;

    function createDeal(address _exporter, string memory _goods, uint _amount) internal {
        dealCount++;
        deals[dealCount] = Deal(dealCount, msg.sender, _exporter, _goods, _amount, "", false, false);
    }

    function uploadDocument(uint _id, string memory _hash, address _admin) internal {
        Deal storage deal = deals[_id];
        require(msg.sender == deal.importer || msg.sender == _admin, "Only importer or admin can upload");
        deal.documentHash = _hash;
    }

    function approveDeal(uint _id) internal {
        Deal storage deal = deals[_id];
        require(msg.sender == deal.exporter, "Only exporter can approve");
        deal.approved = true;
    }

    function verifyDelivery(uint _id) internal {
        deals[_id].deliveryVerified = true;
    }
}

// ESCROW PAYMENT MODULE

contract EscrowPayment {
    struct Payment {
        uint dealId;
        address payer;
        address payee;
        uint amount;
        bool released;
        bool locked;
    }

    mapping(uint => Payment) public payments;

    function deposit(uint _dealId, address _payee) internal {
        require(payments[_dealId].amount == 0, "Already deposited");
        require(msg.value > 0, "Deposit must be greater than zero");
        payments[_dealId] = Payment(_dealId, msg.sender, _payee, msg.value, false, true);
    }
}


// ADMIN DASHBOARD MODULE

contract AdminDashboard {
    mapping(address => bool) public flaggedUsers;

    function flagUser(address _user) internal {
        flaggedUsers[_user] = true;
    }

    function unflagUser(address _user) internal {
        flaggedUsers[_user] = false;
    }
}


// MAIN CONTROLLER CONTRACT

contract SmartLCSystem is
    Adminable,
    KYCVerification,
    DealManagement,
    AdminDashboard,
    EscrowPayment
{
    event UserRegistered(address user, string role);
    event UserVerified(address user);
    event DealCreatedEvent(uint id, address importer, address exporter, uint amount);
    event PaymentDeposited(uint dealId, address payer, address payee, uint amount);
    event PaymentReleased(uint dealId, address receiver);
    event PaymentRefunded(uint dealId, address receiver);

    constructor() Adminable(msg.sender) {}

    //  USER REGISTRATION 
    function registerNewUser(string memory _name, string memory _role) public {
        registerUser(_name, _role);
        emit UserRegistered(msg.sender, _role);
    }

    //  VERIFY USER 
    function verifyRegisteredUser(address _user) public onlyAdmin {
        _verifyUser(_user);
        emit UserVerified(_user);
    }

    //  DEAL MANAGEMENT 
    function createNewDeal(address _exporter, string memory _goods, uint _amount) public {
        createDeal(_exporter, _goods, _amount);
        emit DealCreatedEvent(dealCount, msg.sender, _exporter, _amount);
    }

    function uploadDealDocument(uint _id, string memory _hash) public {
        uploadDocument(_id, _hash, admin);
    }

    function approveDealByExporter(uint _id) public {
        approveDeal(_id);
    }

    function verifyDealDelivery(uint _id) public onlyAdmin {
        verifyDelivery(_id);
    }

    // ESCROW PAYMENT MANAGEMENT 
    function depositToEscrow(uint _dealId, address _payee) public payable {
        deposit(_dealId, _payee);
        emit PaymentDeposited(_dealId, msg.sender, _payee, msg.value);
    }

    function finalizeDealPayment(uint _dealId, bool goodsDelivered) public onlyAdmin {
        Payment storage p = payments[_dealId];
        Deal storage d = deals[_dealId];
        require(p.locked == true, "Funds not locked or already released");

        p.locked = false;
        p.released = true;

        if (goodsDelivered) {
            d.deliveryVerified = true;
            payable(p.payee).transfer(p.amount);
            emit PaymentReleased(_dealId, p.payee);
        } else {
            payable(p.payer).transfer(p.amount);
            emit PaymentRefunded(_dealId, p.payer);
        }
    }

    //  ADMIN CONTROLS 
    function flagSuspiciousUser(address _user) public onlyAdmin {
        flagUser(_user);
    }

    function unflagSuspiciousUser(address _user) public onlyAdmin {
        unflagUser(_user);
    }

    //  VIEW FUNCTIONS 
    function checkUserDetails(address _user) public view returns (User memory) {
        return getUser(_user);
    }

    function getDealDetails(uint _id) public view returns (Deal memory) {
        return deals[_id];
    }

    function getPaymentDetails(uint _dealId) public view returns (Payment memory) {
        return payments[_dealId];
    }
}