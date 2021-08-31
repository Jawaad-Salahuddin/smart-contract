pragma solidity >=0.5.0 <0.9.0;

contract Contract {
  uint public taskCount = 0;

  struct Task {
    uint id;
    string content;
    bool completed;
    address sender;
    uint reward;
  }

  mapping (uint => Task) public tasks;
  mapping (address => uint) public balances;

  event TaskCreated(uint id, string content, bool completed, address sender, uint reward);
  event TaskCompleted(uint id, address receiver);

  function createTask(string memory _content, address _sender, uint _reward) public {
    taskCount++;
    tasks[taskCount] = Task(taskCount, _content, false, _sender, _reward);
    emit TaskCreated(taskCount, _content, false, _sender, _reward);
  }

  function redeem(uint _id, address receiver) public payable {
    Task memory _task = tasks[_id];
    require(_task.reward <= balances[receiver], "Insufficient balance");
    _task.completed = true;
    balances[receiver] -= _task.reward;
    balances[_task.sender] += _task.reward;
    emit TaskCompleted(_id, receiver);
  }
}