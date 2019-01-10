import React, { Component } from "react";
import {browserHistory} from 'react-router';
import SearchList from './SearchList.js';
import './SearchPage.css';

export default class SearchPage extends Component {
    abortController = new window.AbortController();
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            planetData: [],
            searchPlanetData: [],
            planetDetail:null,
            nextPage:null, 
            searchCounter:0
        };
        this.logoutUser = this.logoutUser.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.searchResultForPlanets = this.searchResultForPlanets.bind(this);
        this.searchResultForPlanets()
    }
    componentDidMount() {
        if (localStorage.getItem("username") == "") {
			browserHistory.goBack();
        }
    }
    updateSearch = (e) => {
        this.abortController.abort();
        e.preventDefault();
        
        this.setState({search: e.target.value}, () => {
            this.searchResultForPlanets()
        });
        
      }
    searchResultForPlanets() {
        if ((localStorage.getItem('username')) != "Luke Skywalker") {
          if(localStorage.getItem('searchCounter') == "NaN") {
            localStorage.setItem('searchCounter', "0");
          }
          console.log(localStorage.getItem('searchCounter'))
        
        if (localStorage.getItem('searchCounter') == "0") {
            localStorage.setItem('SearchDate', Date.now());
        }
        var aCounter = parseInt(localStorage.getItem('searchCounter')) + 1 
        localStorage.setItem('searchCounter', aCounter);
        if (parseInt(localStorage.getItem('searchCounter')) >= 5) {
            console.log((((Date.now() - localStorage.getItem('SearchDate')))/1000))
            if ((((Date.now() - localStorage.getItem('SearchDate')))/1000) < 60)  {
                alert("Search exceeds from limit")
                return
            }
            else {
                localStorage.setItem('searchCounter', "0");
            }
        }
    }
        //     if (this.state.search.length === 0) {
        //     setTimeout(() => {
        //         this.setState({nextPage:null});
        //         this.setState({planetData: [], searchPlanetData: []})    
        //     }, 3000);
        //     return
        // }
    this.abortController = new window.AbortController();
    fetch(`https://swapi.co/api/planets/?search=${this.state.search}`,{
      method: 'get',
      signal: this.abortController.signal,
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
         localStorage.clear()
         localStorage.setItem("username", "")
         localStorage.setItem("searchCounter", "0")
         localStorage.setItem("SearchDate", Date.now())
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
                <input type="text" placeholder="Search planet here" ref={input => this.search = input} onChange={this.updateSearch} />
            </div>
           </div>
         <div class="containerList">
           <SearchList searchListData={this.state.planetData} nextPageData= {this.state.nextPage} />
         </div>
         </div>
        );
    }
}
