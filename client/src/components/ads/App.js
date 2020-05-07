import React, { Component } from "react";
import axios from "axios";

import {Container, Card, Row, Col} from "react-bootstrap";
import "./App.css";

export default class App extends Component {

  constructor(props){

    super(props);

    this.state = {
      ads: [],
      API_URL_BASE: "http://localhost:9000/apiv1",
      search: window.location.search,
      token: "",
    }
  }

  callAPIAuth(){

    //axios.defaults.withCredentials = true;
    axios.post('http://localhost:9000/apiv1/loginJWT', {
      email: 'user@example.es',
      password: '123456'
    })
    .then(res => {

      const token = res.data.token;
      console.log(token);
      this.setState({ token });
    })
    .catch(function (error) {

      console.log(error);
    });

  }

  callAPI(){

    axios.get(`${this.state.API_URL_BASE}/ads/${this.state.search}?token=${this.state.token}`)
      .then(res => {

        const ads = res.data;
        this.setState({ ads });
      }).catch(() => {
        
        alert("Error to list advertisements, pleas try again");
      })

  }


  componentDidMount() {

    this.callAPIAuth();
    this.callAPI();
  }

  render() {

    const { ads } = this.state;

    return (
      <Container>
        <Row className="mt-5">
            { ads.map(ad => 
            
              <Col key={ad._id} className="col-12 col-sm-6 col-lg-4 mb-5">
            
                <Card className="card-ads">
                    <Card.Img className="img-card" variant="top" src={`http://localhost:9000/images/ads/${ad.photo}`} />
                    <Card.Body>
                        <Card.Title>{ad.name}</Card.Title>
                        <Card.Text as={"div"}>
                            <dl>
                                <dt>Precio: {ad.price} €</dt>

                                <dt>Tipo:</dt>
                                <dd>{ad.type}</dd>

                                <dt>Tags:</dt>
                                { ad.tags && ad.tags.map(tag => (
                                    <dd key={tag}>
                                        {tag}
                                    </dd>
                                ))
                                }
                            </dl>
                        </Card.Text>
                        <Card.Footer>
                            <small className="text-muted">ID: {ad._id}</small>
                        </Card.Footer>
                    </Card.Body>
                </Card>
              </Col>
            )}
        </Row>
      </Container>
    )
  }
}