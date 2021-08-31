import { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import * as a from '../Contract.json'
import { abi, address } from './config'
import Contract from './Contract'

class App extends Component<{}, { account: string, contract: any, taskCount: number, tasks: any[], loading: boolean }> {
  componentDidMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    let web3 = window.web3
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
    } else {
      window.alert("Please connect to Metamask.")
    }
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      try {
        // Request account access if needed
        await window.ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const contract = a
    console.log(contract)
    //const contract = new web3.eth.Contract(abi, address)
    this.setState({ contract })
    const taskCount: number = await contract.methods.taskCount().call()
    this.setState({ taskCount })
    for (var i = 1; i <= taskCount; i++) {
      const task = await contract.methods.tasks(i).call()
      this.setState({
        tasks: [...this.state.tasks, task]
      })
    }
    this.setState({ loading: false })
  }

  constructor(props: any) {
    super(props)
    this.state = {
      account: '',
      contract: {},
      taskCount: 0,
      tasks: [],
      loading: true
    }

    this.createTask = this.createTask.bind(this)
  }

  createTask(content: string) {
    this.setState({ loading: true })
    this.state.contract.methods.createTask(content).send({ from: this.state.account })
    .once('receipt', () => {
      this.setState({ loading: false })
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="https://github.com/Jawaad-Salahuddin" target="_blank" rel="noreferrer">View Code on GitHub</a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small><a className="nav-link" href="#"><span id="account"></span></a></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
              {
                this.state.loading
                  ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                  : <Contract tasks={this.state.tasks} createTask={this.createTask} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

declare global {
  interface Window {
    ethereum: any
    web3: any
  }
}

export default App