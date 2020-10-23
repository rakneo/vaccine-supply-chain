pragma solidity ^0.5.0;

/// Import Partnerships library
import "../../utils/Partnerships.sol";


/// @author Rakshith Vikramraj
/// @title Drug Design Chain Contract
contract DrugDesign {
    using Partnerships for Partnerships.Partnership;

    /// Variable for tracking Universal Drug Product Code (UDPC)
    uint public udpc;

    /// Public mapping from UDPC to a Drug Design Item
    mapping (uint => DrugDesignItem) dDItems;

    /// Enumaration for defining variety of Drug Design State
    enum DrugDesignState {
        Owned,
        Tested,
        Approved,
        ForSale
    }

    /// Structure keeping meta data for a Drug Design **TODO**
    struct DrugDesignMeta {
        string name;
        string description;
        string notes;
    }

    /// Structure for Drug Design Test Case **TODO**
    struct DrugDesignTestCase {
        address testerId;
        uint timeStamp;
        bool isPassed;
        string description;
        string notes;
    }

    /// Structure for keeping Drug Design fields structured
    struct DrugDesignItem {
        uint udpc;
        address payable currentOwner;
        address designerId;
        string designerName;
        DrugDesignState state;
        DrugDesignMeta metaData;
        uint salePrice;
        uint testIndexed;
        mapping(uint => DrugDesignTestCase) testCases;
        Partnerships.Partnership manufacturers;
    }

    /// Event to emit them for users in functions, accept `udpc` as input
    event Owned(uint udpc);
    event TestCaseAdded(uint udpc);
    event Approved(uint udpc);
    event UpForSale(uint udpc);
    event DrugDesignPurchased(uint udpc);
    event SaleCanceled(uint udpc);
    event UpForPartnered(uint udpc);
    event UpForRestrictPartnered(uint udpc);
    event PartnerGained(uint udpc);
    event RestrictPartnerTransfered(uint udpc, address partner);
    event PartnerClosed(uint udpc);

    /// Modifier that checks the paid enough as expected and refunds the remaining balance
    modifier checkDrugDesignPaymentValue(uint _udpc) {
        require(msg.value >= dDItems[_udpc].salePrice, "Not Enough!");
        _;
        uint _price = dDItems[_udpc].salePrice;
        uint amountToReturn = msg.value - _price;
        if (amountToReturn != 0)
            address(msg.sender).transfer(amountToReturn);
    }

    /// Modifier that checks if an DrugDesignItem.state of a udpc is Owned
    modifier isOwned(uint _udpc) {
        require(dDItems[_udpc].state == DrugDesignState.Owned);
        _;
    }

    /// Modifier that checks if an DrugDesignItem.state of a udpc is Tested
    modifier isTested(uint _udpc) {
        require(dDItems[_udpc].state == DrugDesignState.Tested);
        _;
    }

    /// Modifier that checks if an DrugDesignItem.state of a udpc is Approved
    modifier isApproved(uint _udpc) {
        require(dDItems[_udpc].state == DrugDesignState.Approved);
        _;
    }

    /// Modifier that checks if the caller he is the currentOwner of Drug Design
    modifier onlyOwnerOf(uint _udpc) {
        require(dDItems[_udpc].currentOwner == msg.sender);
        _;
    }

    /// Modifier that checks if the caller he is the currentOwner of Drug Design
    modifier drugDesignForSale(uint _udpc) {
        require(dDItems[_udpc].state == DrugDesignState.ForSale);
        _;
    }

    /// Modifier that checks if an DrugDesignItem.manufacturers.state of a udpc is Opened
    modifier isPartnerOpened(uint _udpc) {
        require(dDItems[_udpc].manufacturers.state == Partnerships.PartnershipState.Opened);
        _;
    }

    /// Modifier that checks if an DrugDesignItem.manufacturers.state of a udpc is Restricted
    modifier isPartnerRestricted(uint _udpc) {
        require(dDItems[_udpc].manufacturers.state == Partnerships.PartnershipState.Restricted);
        _;
    }

    /// Modifier that checks if an DrugDesignItem.manufacturers.state of a udpc is Closed
    modifier onlyManufacturPartnerOf(uint _udpc) {
        require((dDItems[_udpc].manufacturers.has(msg.sender)) || (address(dDItems[_udpc].currentOwner) == msg.sender));
        _;
    }

    /// Constructor Function sets up UDPC to 0
    constructor() public {
        udpc = 0;
    }

    function getUdpc() public view returns(
        uint _udpc
    ){
        _udpc = udpc;
    }

    /// Function helps Designer to establish a new Drug Design
    function designDrug(
        string memory _designerName,
        string memory _drugName,
        string memory _description,
        string memory _notes
    )
        public
    {
        udpc ++;
        DrugDesignItem memory newDDItem;
        newDDItem.udpc = udpc;
        newDDItem.currentOwner = msg.sender;
        newDDItem.designerId = msg.sender;
        newDDItem.designerName = _designerName;
        newDDItem.state = DrugDesignState.Owned;
        newDDItem.metaData = DrugDesignMeta(_drugName, _description, _notes);
        newDDItem.salePrice = 0;
        newDDItem.manufacturers.partnersIndex = 1;
        dDItems[udpc] = newDDItem;
        emit Owned(udpc);
    }

    /// Add Test Case for Drug Design by currentOwner
    function addTestCase(
        uint _udpc,
        string memory _description,
        bool _isPassed,
        string memory _notes
    )
        public
        onlyOwnerOf(_udpc)
    {
        require(_udpc <= udpc, 'Given UDPC Not Created Yet!');
        DrugDesignTestCase memory _ddtc = DrugDesignTestCase(
            msg.sender,
            block.timestamp,
            _isPassed,
            _description,
            _notes
        );
        dDItems[_udpc].testCases[dDItems[_udpc].testIndexed] = _ddtc;
        dDItems[_udpc].testIndexed ++;
        if (dDItems[_udpc].state == DrugDesignState.Owned)
            dDItems[_udpc].state = DrugDesignState.Tested;
        emit TestCaseAdded(_udpc);
    }

    // Add Test Case for Drug Design by regulator
    function addTestCaseByRegulaor(
        uint _udpc,
        string memory _description,
        bool _isPassed,
        string memory _notes
    )
        public
    {
        require(_udpc <= udpc, 'Given UDPC Not Created Yet!');
        DrugDesignTestCase memory _ddtc = DrugDesignTestCase(
            msg.sender,
            block.timestamp,
            _isPassed,
            _description,
            _notes
        );
        dDItems[_udpc].testCases[dDItems[_udpc].testIndexed] = _ddtc;
        dDItems[_udpc].testIndexed ++;
        if (dDItems[_udpc].state == DrugDesignState.Owned)
            dDItems[_udpc].state = DrugDesignState.Tested;

        emit TestCaseAdded(_udpc);
    }

    /// Function to approve drug by a regulator only
    function approveDrug(uint _udpc) public isTested(_udpc) {
        dDItems[_udpc].state = DrugDesignState.Approved;

        emit Approved(_udpc);
    }

    /// Function to sale a drug design
    function upForSale(uint _udpc,uint _price)
        public
        onlyOwnerOf(_udpc)
        isApproved(_udpc)
    {
        dDItems[_udpc].salePrice = _price;
        dDItems[_udpc].state = DrugDesignState.ForSale;

        emit UpForSale(_udpc);
    }

    /// Function to purchase a drug design
    function purchaseDrugDesign(uint _udpc)
        public
        payable
        drugDesignForSale(_udpc)
        checkDrugDesignPaymentValue(_udpc)
    {
        dDItems[_udpc].state = DrugDesignState.Approved;
        dDItems[_udpc].currentOwner = msg.sender;
        dDItems[_udpc].manufacturers.owner = msg.sender;

        emit DrugDesignPurchased(_udpc);
    }

    /// Function to open partnership for manufacturer
    function openManufactPartnership(uint _udpc, uint _shares)
        public
        isApproved(_udpc)
        onlyOwnerOf(_udpc)
    {
        require(_shares <= 100, "Most be less than %100");
        dDItems[_udpc].manufacturers.defultSharesPresntage = _shares;
        dDItems[_udpc].manufacturers.state = Partnerships.PartnershipState.Opened;

        emit UpForPartnered(_udpc);
    }

    /// Function to build a manufacturer partner contract
    function buildPartnerContract(uint _udpc, string memory _name)
        public
        isApproved(_udpc)
        isPartnerOpened(_udpc)
    {
        dDItems[_udpc].manufacturers.add(msg.sender, _name, 0);

        emit PartnerGained(_udpc);
    }

    /// Function to close manufacturer partnership
    function closeManufactPartnership(uint _udpc)
        public
        onlyOwnerOf(_udpc)
        isPartnerOpened(_udpc)
    {
        dDItems[_udpc].manufacturers.state = Partnerships.PartnershipState.Closed;
        dDItems[_udpc].manufacturers.defultSharesPresntage = 0;

        emit PartnerClosed(_udpc);
    }

    /// Function to open partnership for manufacturer
    function restrictManufactPartnership(uint _udpc)
        public
        isApproved(_udpc)
        onlyOwnerOf(_udpc)
    {
        dDItems[_udpc].manufacturers.state = Partnerships.PartnershipState.Restricted;

        emit UpForRestrictPartnered(_udpc);
    }

    /// Function to build a manufacturer partner contract by the currentOwner when its restracted
    function buildRestrictPartnerContract(
        uint _udpc,
        address payable _partner,
        string memory _name,
        uint _shares
    )
        public
        isApproved(_udpc)
        onlyOwnerOf(_udpc)
        isPartnerRestricted(_udpc)
    {
        require(_shares <= 100, "Most be less than %100");
        dDItems[_udpc].manufacturers.add(_partner, _name, _shares);

        emit RestrictPartnerTransfered(_udpc, _partner);
    }

    function fetchDrugDesignData(uint _udpc) 
        external 
        view 
        returns(
            address currentOwner,
            address designerId,
            string memory designerName,
            string memory drugName,
            string memory currentState,
            bool forSale,
            uint salePrice,
            string memory partnershipState,
            uint partnershipShares,
            uint numberOfTests,
            uint numberOfManufacturers
        )
    {
        require(_udpc <= udpc, 'Given UDPC Not Created Yet!');
        currentOwner = dDItems[_udpc].currentOwner;
        designerId = dDItems[_udpc].designerId;
        designerName = dDItems[_udpc].designerName;
        drugName = dDItems[_udpc].metaData.name;

        if (dDItems[_udpc].state == DrugDesignState.Owned)
            currentState = 'Created';
        else if (dDItems[_udpc].state == DrugDesignState.Tested)
            currentState = 'Tested';
        else if (dDItems[_udpc].state == DrugDesignState.Approved)
            currentState = 'Approved';
        else if (dDItems[_udpc].state == DrugDesignState.ForSale)
            currentState = 'ForSale';
        else if (dDItems[_udpc].state == DrugDesignState.ForSale)
            currentState = 'ForSale';

        partnershipState = dDItems[_udpc].manufacturers.partnershipState();
        partnershipShares = dDItems[_udpc].manufacturers.defultSharesPresntage;

        forSale = (dDItems[_udpc].salePrice != 0);
        salePrice = dDItems[_udpc].salePrice;

        numberOfTests = dDItems[_udpc].testIndexed;
        numberOfManufacturers = dDItems[_udpc].manufacturers.numberOfActive();
    }

    function featchDrugDesignMetaData(uint _udpc) 
        external
        view
        returns(
            string memory name,
            string memory description,
            string memory notes
        )
    {
        require(_udpc <= udpc, 'Given UDPC Not Created Yet!');
        (name, description, notes) = (
            dDItems[_udpc].metaData.name,
            dDItems[_udpc].metaData.description,
            dDItems[_udpc].metaData.notes
        );
    }

    function featchDrugDesignTestCases(uint _udpc, uint _testIndex) 
        external
        view
        returns(
            string memory description,
            bool isPassed, 
            string  memory notes
        )
    {
        require(_udpc <= udpc, 'Given UDPC Not Created Yet!');
        require(_testIndex < dDItems[_udpc].testIndexed, 'Test Case Not Created Yet!');
        
        (description, isPassed, notes) = (
            dDItems[_udpc].testCases[_testIndex].description,
            dDItems[_udpc].testCases[_testIndex].isPassed,
            dDItems[_udpc].testCases[_testIndex].notes
        );
        
    }

    function isManufacturerOf(uint _udpc, address _manufacturerId) external view returns(bool) {
        return dDItems[_udpc].manufacturers.has(_manufacturerId);
    }

    function manufacturerSharesOf(uint _udpc, address _manufacturerId) external view returns(uint) {
        return dDItems[_udpc].manufacturers.sharesOf(_manufacturerId);
    }



}
