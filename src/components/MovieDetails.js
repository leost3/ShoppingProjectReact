import React from 'react';
import axios from 'axios';
import Buttons from './Buttons';
import youtube from '../api/youtube';
import MoviesListHeader from './moviesListHeader';
import PostRequest from '../api/Database';
import size from './helpers/general';
import { withRouter } from 'react-router-dom';
import  ProgressBar  from './PrograssBar';
import FavoriteButton from './FavoriteButton';


class Movie extends React.Component {
    state = {
        movieDetails: {},
        userInfo: [],
        movieRating: {},
        movieRateAvg: null,
        youTubeVideo: {},
        isFavorite: false,
    }

    async componentDidMount() {
        const movieId = this.props.match.params.movieId;
        const KEY = 'f94e9a18c1c262bae36e6cdc7be57a1d';
        const getMovieDetailsById = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${KEY}`;
        const response = await axios(getMovieDetailsById);
        const movieDetails = response.data;
        this.setState({...this.state.movieDetails, movieDetails});
        this.setState({userInfo:this.props.userInformation});
        this.getMovieAvg();
        this.getMovieGeneralRatingFromDb();
        this.requestTrailerFromYoutube(this.state.movieDetails.title + "movie official trailer");
        this.checkIfMovieIsFavorited();
    }

    // Send movie to favorites list
    addToFavorites = () => {
      PostRequest.post(
        '/movies.php',
        {
          "action": "addToFavorites",
          "movieId": this.state.movieDetails.id,
          "movieTitle": this.state.movieDetails.title,
          "poster_path": this.state.movieDetails.poster_path,
          "userId": parseInt(this.state.userInfo.userId)
        },
      )
      .then( () => {
        // Return True or False if movie is on User's favorites
          // this.checkIfMovieIsFavorited();
          this.setState({ isFavorite: true});
      })
      .catch( error => {
        console.log(error);
      });
    }

    sendUserRating = (rate) => {
      
      PostRequest.post(
        '/movies.php',
          {
            "action": "rateMovie",
            "movieId": this.state.movieDetails.id,
            "userId": this.state.userInfo.userId,
            "userRate": rate,
          },
        )
        .then( response => {
            this.setState({...this.state.movieRating, movieRating:response.data.result[0]});
            this.getMovieAvg();
        })
        .catch( error => {
          console.log(error);
        });
    }

    getMovieAvg = () => {
      PostRequest.post(
        '/movies.php',
        {
          "action": "getAvg",
          "movieId": this.state.movieDetails.id,
        },
      )
      .then( response => {
        this.setState({movieRateAvg: parseFloat(response.data.result['AVG(movie_rating)']).toFixed(1)});
      })
      .catch( error => {
        console.log(error);
      });
    }


    getMovieGeneralRatingFromDb = () => {
        PostRequest.post(
          '/movies.php',
          {
            "action": "getRatings",
            "movieId": this.state.movieDetails.id,
            "userId": this.state.userInfo.userId,
          },
        )
        .then( response => {
          this.setState({...this.state, movieRating: response.data.result[0]});
        })
        .catch( error => {
          console.log(error);
        });
      }

    checkIfMovieIsFavorited = () => {
      PostRequest.post(
        '/movies.php',
        {
          "action": "isFavorite",
          "movieId": parseInt(this.state.movieDetails.id)
        },
      )
      .then( response => {
        this.setState({isFavorite:response.data.result});
      })
      .catch( error => {
        console.log(error);
      });
    }

    setMovieRating = (rate) => {
        this.sendUserRating(parseInt(rate));
    }

    displayVotingBtns = () => {
        const btns  = []
        for (let i=0;i<=10;i++) {
            btns.push(
            <Buttons
                setMovieRating={this.setMovieRating} 
                hasUserRated={this.state.movieRating !== undefined ? true : false } 
                i={i} 
                key={i} 
            />)
        }
        return (
            btns
        )
    }

    renderRadialProgressBarUser = () => {
      if (this.state.movieRating!== undefined) {
        return (
          <div className="usersVote">
              <ProgressBar rating={this.state.movieRating.movie_rating}/>
              <div>
                  <p>Thanks for your vote!</p>
              </div>
          </div>
        )
      }
      return "Not voted";
    }
    renderRadialProgressBarGeneral = () => {
      if (this.state.movieRateAvg !== "NaN") {
        return (
          <div className="generalVotings">
              <ProgressBar rating={this.state.movieRateAvg}/> 
          </div>
        )
      }
      return "No user has voted in this movie yet";
    }

    
    requestTrailerFromYoutube = async (term) => {
      const response = await youtube.get("/search", {
        params: {
          q: term
        }
      });
      this.setState({
          ...this.state.youTubeVideo, youTubeVideo: response.data.items[0],
      });
    };

    renderVideoFrame = () => {
        if (this.state.youTubeVideo.id) {
            return (
                  <div className="movieVideo">
                      <div className="ui embed">
                          <iframe className="iFrame" title="video player" src={`https://www.youtube.com/embed/${this.state.youTubeVideo.id.videoId}`} />
                      </div>
                  </div>
            )
        }
        return (
            <h1>Loading</h1>
        )
    }

    renderFavoriteButton = () => {
      
      // if (!this.state.isFavorite) {
      //   return (
      //     <div className="btnIsNotFavorite">
      //       <button onClick={this.addToFavorites}> 
      //         <i className="fas fa-star"></i>
      //       </button>
      //       <p> Add <span className='movieTitle'>{this.state.movieDetails.title}</span> to your favorite list</p>
      //     </div>
      //   )
      // }
      // return (
      //   <div className="btnIsFavorite">
      //       <i className="fas fa-star"></i> 
      //       <p> {this.state.movieDetails.title} is in your favorite list</p>
      //   </div>
      // )
    }


    render() {
        
        const {title, overview, release_date, backdrop_path} = this.state.movieDetails;

        if (this.state.movieDetails) {
            return (
                <div className="movieDetails_page">
                    <MoviesListHeader />
                    <div>
                        <img 
                            className="moviePoster" 
                            // make base_url reusable http://image.tmdb.org/t/p
                            src={`http://image.tmdb.org/t/p/${size[6]}/${backdrop_path}`} 
                            alt={title} 
                        />
                    </div>
                    <div className="movieDescription">
                        <h1>{title}</h1>
                        <h2>Overview</h2> 
                        <p>{overview}</p>
                        <h2>Release Date </h2>
                        <p>{release_date}</p>
                    </div>
                    <FavoriteButton 
                      isFavorite={this.state.isFavorite}
                      addToFavorites={this.addToFavorites}
                      title={this.state.movieDetails.title}
                    />
                    {/* {this.renderFavoriteButton()} */}
                    <div className="movieRatings">
                        <div className="loggedUserRatings">
                            <h1>Your Rating</h1> {this.renderRadialProgressBarUser()}
                        </div>
                        <div className="avgGeneralRatings">
                            <h1>Users average Rating</h1> {this.renderRadialProgressBarGeneral()}
                        </div>
                    </div>
                    <div className="votingBtns">
                        {this.displayVotingBtns()}
                    </div>
                    {this.renderVideoFrame()}

                </div>
    
            )
        }
        return (
            <svg viewBox="0 0 50 50">
                <circle className="ring" cx="25" cy="25" r="20"></circle>
                <circle className="ball" cx="25" cy="5" r="3.5"></circle>
            </svg>
        )
    }
}

export default withRouter(Movie);
