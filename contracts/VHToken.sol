pragma solidity ^0.4.7;

contract token {
    uint256 public totalSupply;
    function balanceOf(address _owner) constant returns (uint256 balance);
    function transfer(address _to, uint256 _value) returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
    function approve(address _spender, uint256 _value) returns (bool success);
    function allowance(address _owner, address _spender) constant returns (uint256 remaining);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

contract owned {
  address public owner;
  function owned() {
    owner = msg.sender;
  }

  modifier onlyOwner {
    if (msg.sender != owner) throw;
    _;
  }
}


/*  ERC 20 token */
contract standardToken is token,owned {

    function transfer(address _to, uint256 _value) returns (bool success) {
      if (balances[msg.sender] >= _value && _value > 0) {
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        Transfer(msg.sender, _to, _value);
        return true;
      } else {
        return false;
      }
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
      if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && _value > 0) {
        balances[_to] += _value;
        balances[_from] -= _value;
        allowed[_from][msg.sender] -= _value;
        Transfer(_from, _to, _value);
        return true;
      } else {
        return false;
      }
    }

    function balanceOf(address _owner) constant returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
      return allowed[_owner][_spender];
    }

    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;
}

contract safeMath {
     function assert(bool assertion) internal {
       if (!assertion) {
         throw;
       }
     }

    function safeAdd(uint256 x, uint256 y) internal returns(uint256) {
      uint256 z = x + y;
      assert((z >= x) && (z >= y));
      return z;
    }

    function safeSubtract(uint256 x, uint256 y) internal returns(uint256) {
      assert(x >= y);
      uint256 z = x - y;
      return z;
    }

    function safeMult(uint256 x, uint256 y) internal returns(uint256) {
      uint256 z = x * y;
      assert((x == 0)||(z/x == y));
      return z;
    }
}

contract VHToken is standardToken, safeMath {
    string public constant name = "VHT";
    string public constant symbol = "VHT";
    uint256 public constant decimals = 18;
    uint256 public constant factorial = 6;
    string public version = "1.0";

    address public preICO_VenheAcc; //预热ico用的Venhe币地址。预留比例10%；
    address public ico_VenheAcc; //正式ico的Venhe币地址。预留比例41%；
    address public allocated_venheAcc; //保留的49%Venhe币地址；
    address public ethAcc; //融资完成后的以太币转账地址；
    
    //预热ico的总量 10%
    uint256 public constant vhPreIcoAmount = 105 * (10**factorial) * 10**decimals; 
    //正式 ico总量 41%
    uint256 public constant vhIcoAmount = 252 * (10**factorial) * 10**decimals;
    //保留的代币总量 49%
    uint256 public constant vhAllocatedAmount = 343 * (10**factorial) * 10**decimals;
    
    uint256 public constant vhPreICOCap = 448 * (10**factorial) * 10**decimals;
    uint256 public constant vhICOCap = 700 * (10**factorial) * 10**decimals;


    bool public isFinalized;
    bool public isPreICO;
    bool public isHalted;

    uint256 public constant p0Rate = 31050;
    uint256 public constant p1Rate = 29700;
    uint256 public constant p2Rate = 28350;
    uint256 public constant p3Rate = 27000;
    uint256 public currRate;
    uint256 public fundingStartBlock;
    uint256 public fundingEndBlock;

    uint256 public fundingP2Block;
    uint256 public fundingP3Block;

    function VHToken(
        address _preICO_VenheAcc,
        address _ico_VenheAcc,
        address _allocated_venheAcc,
        address _ethAcc,
        uint256 _fundingStartBlock,
        uint256 _fundingEndBlock
    ) {
        preICO_VenheAcc = _preICO_VenheAcc;
        ico_VenheAcc = _ico_VenheAcc;
        allocated_venheAcc = _allocated_venheAcc;
        ethAcc = _ethAcc;

        balances[preICO_VenheAcc] = vhPreIcoAmount;
        balances[ico_VenheAcc] = vhIcoAmount;
        balances[allocated_venheAcc] = vhAllocatedAmount;
        
        isFinalized = false;
        isPreICO = true;
        isHalted = false;
        totalSupply = vhAllocatedAmount;
        
        currRate = p0Rate;
        fundingStartBlock = _fundingStartBlock;
        fundingEndBlock = _fundingEndBlock;
    }

    function () payable {
        if (isFinalized) throw;
        if (isHalted) throw;
        if (block.number < fundingStartBlock) throw;
        if (block.number > fundingEndBlock) throw;
        if (msg.value == 0 ) throw;

        uint256 tokens;
        uint256 checkedSupply;
        if (isPreICO) {
            if (msg.sender == preICO_VenheAcc) throw; //不允许自循环
            tokens = safeMult(msg.value, currRate);
            checkedSupply = safeAdd(totalSupply,tokens);

            if (balances[preICO_VenheAcc]>=tokens && checkedSupply<=vhPreICOCap) {
                totalSupply = checkedSupply;
                balances[msg.sender] = safeAdd(balances[msg.sender],tokens);
                balances[preICO_VenheAcc] = safeSubtract(balances[preICO_VenheAcc],tokens);
            }
            else throw;
        } else {
            if (msg.sender == ico_VenheAcc) throw; //不允许自循环
            if (block.number >fundingP2Block) {
                currRate = p2Rate;
            }
            if (block.number >fundingP3Block) {
                currRate = p3Rate;
            }

            tokens = safeMult(msg.value, currRate);
            checkedSupply = safeAdd(totalSupply,tokens);
            
            if (balances[ico_VenheAcc]>=tokens && checkedSupply<=vhICOCap) {
                totalSupply = checkedSupply;
                balances[msg.sender] = safeAdd(balances[msg.sender],tokens);
                balances[ico_VenheAcc] = safeSubtract(balances[ico_VenheAcc],tokens);
            } else throw;
        }
    }

    function preIcoFinalized() onlyOwner {
        if (isFinalized) throw;
        if (block.number<=fundingEndBlock) throw;
        
        //暂时结束合约，不再接受以太币，直到正式ICO启动；
        isFinalized = true;
        //preICO只会出现一次
        isPreICO = false;
        //结束preICO的时候，将多余的代币转入到ico_VenheAcc账户中；
        uint256 amount = balances[preICO_VenheAcc];
        balances[preICO_VenheAcc] = 0;
        balances[ico_VenheAcc] += amount;

        if(!ethAcc.send(this.balance)) throw;
    }

    function formalIcoStart(
        uint256 _fundingStartBlock,
        uint256 _fundingP2Block,
        uint256 _fundingP3Block,
        uint256 _fundingEndBlock
    ) onlyOwner {
        if (isPreICO) throw; //如果preICO没有结束，则正式ico无法开始
        fundingStartBlock = _fundingStartBlock;
        fundingP2Block = _fundingP2Block;
        fundingP3Block = _fundingP3Block;
        fundingEndBlock = _fundingEndBlock;

        isFinalized = false;
        currRate = p1Rate;
    }

    function icoFinalized() onlyOwner {
        if (isFinalized) throw;
        if (block.number<=fundingEndBlock) throw;

        isFinalized = true;
        if(!ethAcc.send(this.balance)) throw;
    }

    function sendEth(uint amount) onlyOwner {
      uint ethAmount = amount * 1 ether;
      if(!ethAcc.send(ethAmount)) throw;
    }

    function halt() onlyOwner {
        isHalted = true;
    }

    function unhalt() onlyOwner {
        isHalted = false;
    }
}