import React, { Component } from "react";
import { browserHistory} from 'react-router';
import DetailInfo from './DetailInfo.js';
import './SearchList.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { parse } from "querystring";

export default class SearchList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            planetDetail: null,
            searchListPlanet: props.searchListData,
            nextPageUrl: props.nextPageData,
            isHasMore: false
        }
        this.openDetailPage = this.openDetailPage.bind(this);
        this.closeDetail = this.closeDetail.bind(this);
        this.paginationSearchResultCall = this.paginationSearchResultCall.bind(this);
        this.getPercentageForPlanets = this.getPercentageForPlanets.bind(this);
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.searchListData !== this.props.searchListData){
            this.setState({searchListPlanet:nextProps.searchListData});
        }
        if(nextProps.nextPageData !== this.props.nextPageData){
            this.setState({nextPageUrl:nextProps.nextPageData});
        }
        this.state.nextPageUrl != null ? this.setState({isHasMore: true}) : this.setState({isHasMore: false})
        this.getPercentageForPlanets()
    }
    openDetailPage(e)  {
            let array = this.state.searchListPlanet.filter(parseResult => {
            return (parseResult.name == e.currentTarget.title) 
		});
        this.setState({planetDetail: array[0]}, () =>
             { if (this.state.planetDetail !=null) {
                 document.getElementById("detailScreen").style.display = "block";
             }
            });
    }
    getPercentageForPlanets() {
        var xValues = this.state.searchListPlanet.map(function (o) {
            var value = parseInt((parseInt(o.population)));
            var newValue = (isNaN(value) ? 0 : value);
            return newValue;
          });
        return xValues.length === 0 ? 0 : Math.max(...xValues)
    }
    paginationSearchResultCall() {
        console.log(this.state.nextPageUrl)
        fetch(this.state.nextPageUrl,{
            method: 'GET',
            headers: {'Content-type': 'application/json'},
        }).then(response => response.json()).then(data=> {
           var resultData = data.results.sort((a,b) => parseInt(a.diameter) < parseInt(b.diameter));
           var appendData =  this.state.searchListPlanet.concat(resultData)
           this.setState({searchListPlanet: appendData})
           this.setState({nextPageUrl:data.next});
           this.state.nextPageUrl != null ? this.setState({isHasMore: true}) : this.setState({isHasMore: false})
        }
        )
    }  
    closeDetail() {
        document.getElementById("detailScreen").style.display = "none";
		this.setState({planetDetail: null})
    }
    render() {
        return(
        <div>
             <div class="modal" id="detailScreen">
             {this.state.planetDetail !=null?
              <div class="modal-content">
              <a href="javascript:void(0);" onClick={this.closeDetail}>Close</a>
               <DetailInfo planetDetail={this.state.planetDetail} />
             </div> : null} 
             </div>           
       <div id="scrollableDiv" style={{overflow: "auto" }}>
          <InfiniteScroll
            dataLength={this.state.searchListPlanet.length}
            next={this.paginationSearchResultCall}
            hasMore={this.state.isHasMore}
            loader={<p style={{textAlign: 'center'}}>
                   <b>Loading more results ...</b>
                   </p>}
            scrollableTarget="scrollableDiv"
            height={515}
          >
            <ul id="myUL"> {this.state.searchListPlanet.map((parseResult) => 
               {
                const width = (parseResult.population/(this.getPercentageForPlanets())) * 100  
                return (
                 <div title={parseResult.name} value={parseResult} style={{position:'relative',height: 53,borderWidth:0.5,borderStyle:'solid' }} onClick={this.openDetailPage} >  
                 <label style={{marginTop:8, marginLeft:20, position:'absolute',fontSize: '17px',fontWeight: 'bold'}}>{parseResult.name}</label>
                 <label style={{marginTop:30, marginLeft:20, position:'absolute',fontSize: '13px'}}>{"("+parseResult.population+")"}</label>
                 <div style={{display:'inline-block',marginLeft:1,marginRight:2,backgroundColor:'#3aea84',height: 53, width: `${width}%`}}></div>
                 </div>
                 
                );
                }
              )}
             </ul>
          </InfiniteScroll>
        </div>
           </div> 
        );
    }
}