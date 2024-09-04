import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [data, setData] = useState(null);
  const [fanLevel, setFanLevel] = useState(1);

  // Replace with your ESP32 IP
  const esp32Ip = "http://192.168.64.202";

  useEffect(() => {
    // Fetch data from ESP32
    const fetchData = async () => {
      try {
        const response = await axios.get(`${esp32Ip}/data`);
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000); // Fetch data every 1 second
    return () => clearInterval(interval);
  }, [esp32Ip]);

  const handleFanLevelChange = async (event) => {
    const level = event.target.value;
    setFanLevel(level);

    try {
      await axios.post(`${esp32Ip}/fan`, { level });
    } catch (error) {
      console.error("Error setting fan level:", error);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>ESP32 Environmental Data</Card.Title>
              {data ? (
                <Card.Text>
                  <strong>Temperature:</strong> {data.temperature.toFixed(2)} °C{" "}
                  <br />
                  <strong>Humidity:</strong> {data.humidity.toFixed(2)} % <br />
                  <strong>Pressure:</strong> {data.pressure} Pa <br />
                  <strong>AQI:</strong> {data.AQI} <br />
                  <strong>TVOC:</strong> {data.TVOC} ppb <br />
                  <strong>eCO2:</strong> {data.eCO2} ppm
                </Card.Text>
              ) : (
                "Loading..."
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Exhaust Fan Control</Card.Title>
              <Form>
                <Form.Group controlId="fanControl">
                  <Form.Label>Fan Level: {fanLevel}</Form.Label>
                  <Form.Control
                    type="range"
                    min="1"
                    max="3"
                    value={fanLevel}
                    onChange={handleFanLevelChange}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
