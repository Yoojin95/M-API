import { Card, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { favouritesAtom, searchHistoryAtom } from "@/store";
import { getFavourites, getHistory } from "@/lib/userData";
import { authenticateUser } from "@/lib/authenticate";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await authenticateUser(user, password);
      router.push("/favourites");
    } catch (err) {
      setError(err.message);
    }
  };

  async function updateAtoms() {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  }

  return (
    <>
      <Card style={{ border: "none" }}>
        <Card.Body>
          <div
            style={{
              backgroundColor: "#f8f9fa",
              border: "1px solid #dee2e6",
              padding: "20px",
              borderRadius: "5px",
            }}
          >
            <h1>Login</h1>
            Enter your login information below:
          </div>

          <Form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={user} onChange={(e) => setUser(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            {error && (
              <div className="mt-3">
                <Alert variant="danger">{error}</Alert>
              </div>
            )}
            <Button className="mt-3" variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
