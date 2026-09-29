import React, { useState } from 'react'
import axios from 'axios'
import { Container, Form, Button, Row, Col, Card, InputGroup, Alert, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import NavBar from './Components/Navbar'

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://127.0.0.1:3050').replace(/\/+$/, '')

function App() {
    const [movieName, setMovieName] = useState('')
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [hasSearched, setHasSearched] = useState(false)

    const fetchRecommendations = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault()
        }

        const trimmedMovie = movieName.trim()
        if (!trimmedMovie) {
            setError('Please enter a movie name.')
            setRecommendations([])
            setHasSearched(false)
            return
        }

        setLoading(true)
        setError(null)
        setRecommendations([])
        setHasSearched(true)

        try {
            const encodedMovieName = encodeURIComponent(trimmedMovie)
            const response = await axios.get(`${API_BASE_URL}/api/movies/${encodedMovieName}`)
            if (Array.isArray(response.data)) {
                setRecommendations(response.data)
            } else {
                setRecommendations([])
            }
        } catch (err) {
            console.error('Error fetching recommendations', err)
            setRecommendations([])
            if (err.response) {
                if (err.response.status === 404) {
                    setError(`Movie "${trimmedMovie}" was not found. Please try another title (e.g. Avatar, Spider-Man).`)
                } else if (err.response.status === 500 || err.response.status === 502) {
                    setError('Recommendation service error. Please try again in a few moments.')
                } else {
                    setError(err.response.data?.error || 'Failed to fetch recommendations. Please try again.')
                }
            } else if (err.request) {
                setError('Cannot connect to the server. Please ensure the backend is running and reachable.')
            } else {
                setError('An unexpected error occurred. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <NavBar/>
            <Container className="d-flex flex-column align-items-center" >
                <h1 className="my-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight:'600' }}>Movie Recommender</h1>
                <p className="my-2">
                    (<span style={{ color: 'red' }}> <strong>MERN Stack, Django</strong> </span> based Movie recommendation app)
                </p>
                <p>
                    Type Movie name to get recommendations. e.g: 
                    <span style={{ color: 'blue' }}> Avatar</span>, 
                    <span style={{ color: 'blue' }}> Aliens vs Predator: Requiem</span>, 
                    <span style={{ color: 'blue' }}> Spider-Man</span>,
                    <span style={{ color: 'blue' }}> The Avengers</span> etc.
                </p>
                <Form className="w-50" onSubmit={fetchRecommendations}>
                    <Form.Group controlId="movieName">
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Enter movie name"
                                value={movieName}
                                onChange={(e) => setMovieName(e.target.value)}
                                disabled={loading}
                            />
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        Loading...
                                    </>
                                ) : (
                                    'Get Recommendations'
                                )}
                            </Button>
                        </InputGroup>
                    </Form.Group>
                </Form>

                {error && (
                    <Alert variant="danger" className="mt-3 w-50 text-center" onClose={() => setError(null)} dismissible>
                        {error}
                    </Alert>
                )}

                {!loading && !error && hasSearched && recommendations.length === 0 && (
                    <Alert variant="info" className="mt-3 w-50 text-center">
                        No recommendations found for this movie.
                    </Alert>
                )}

                <Container className="mt-4">
                    <Row>
                        {recommendations.map((movie, index) => (
                            <Col md={4} key={movie._id || movie.id || index} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{movie.title || 'Untitled Movie'}</Card.Title>
                                        {movie.tagline ? (
                                            <Card.Subtitle className="mb-2 text-muted">Tagline: {movie.tagline}</Card.Subtitle>
                                        ) : (
                                            <Card.Subtitle className="mb-2" style={{ color: 'red' }}>No Tagline available</Card.Subtitle>
                                        )}
                                        <Card.Text>
                                            <strong>Release Date:</strong> {(movie.release_date && typeof movie.release_date === 'string') ? movie.release_date.slice(0, 10) : 'N/A'}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Duration:</strong> {movie.runtime ? `${movie.runtime} Minutes` : 'N/A'}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
                <h5 style={{ color: 'red' }}>Note: Poster not available due to TMDB access issues.</h5>
                <Link to='/overview'>
                    <Button variant="link" style={{ marginTop: '20px' }}>
                        Know more about the project
                    </Button>
                </Link>
            </Container>
        </>
    )
}

export default App
