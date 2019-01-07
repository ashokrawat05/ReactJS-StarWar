import React, { Component } from "react";
import {browserHistory} from 'react-router';
import SearchList from './SearchList.js';
import './SearchPage.css';

export default class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            planetData: [],
            searchPlanetData: [],
            planetDetail:null,
            nextPage:null
        };
        this.logoutUser = this.logoutUser.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.searchResultForPlanets = this.searchResultForPlanets.bind(this);
    }
    componentDidMount() {
        if (localStorage.getItem("username") == "") {
			browserHistory.goBack();
        }
    }
    updateSearch = (e) => {
        this.setState({search: e.target.value}, () => {
            this.searchResultForPlanets()
        });
        
      }
    searchResultForPlanets() {
        if (this.state.search.length === 0) {
            setTimeout(() => {
                this.setState({nextPage:null});
                this.setState({planetData: [], searchPlanetData: []})    
            }, 3000);
            return
        }
        fetch(`https://swapi.co/api/planets/?search=${this.state.search}`,{
            method: 'GET',
            headers: {'Content-type': 'application/json'},
        }).then(response => response.json()).then(data=> {
           var resultData = data.results.sort((a,b) => parseInt(a.diameter) < parseInt(b.diameter));
           this.setState({nextPage:data.next});
           this.setState({planetData: resultData, searchPlanetData: resultData})
          }
        )
    }  
     getSelectUserPlanets() {
        fetch("https://swapi.co/api/planets/").then(response => response.json()).then(data=> {
           var resultData = data.results.sort((a,b) => parseInt(a.diameter) < parseInt(b.diameter));
           this.setState({planetData: resultData, searchPlanetData: resultData})
          }
        )
     } 
     logoutUser() {
         localStorage.setItem("username", "")
         browserHistory.replace('/searchscreen')
         browserHistory.push('/')
     }
    render() {
        const userName = localStorage.getItem("username")
        return (
          <div>  
          <div class='topnav'>
            <div class="search-container">    
                  <label class="label" for="uname"><b>Welcome, {localStorage.getItem("username")}</b></label> 
                  <a  href="javascript:void(0);" onClick={this.logoutUser} class="logout">Logout</a>
                <input type="text" placeholder="Search here..." ref={input => this.search = input} onChange={this.updateSearch} />
            </div>
           </div>
         <div class="containerList">
           <SearchList searchListData={this.state.planetData} nextPageData= {this.state.nextPage} />
         </div>
         </div>
        );
    }
}
