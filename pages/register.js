import { Card, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";
import { registerUser } from "@/lib/authenticate";

export default function Register() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }
    try {
      await registerUser(user, password, password2);
      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <Card style={{ border: "none" }}>
        <Card.Body>
          <div style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", padding: "20px", borderRadius: "5px", marginBottom: "20px" }}>
            <h1>Register</h1>
            Register for an account:
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>User</Form.Label>
              <Form.Control type="text" value={user} onChange={(e) => setUser(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
            </Form.Group>
            {error && (
              <div className="mt-3">
                <Alert variant="danger">{error}</Alert>
              </div>
            )}
            <Button className="mt-3" variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
