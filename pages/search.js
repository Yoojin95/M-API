import { Form, Button, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { searchHistoryAtom } from "@/store";
import { addToHistory } from "@/lib/userData";

const AdvancedSearch = () => {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      searchBy: "title",
      isOnView: false,
      isHighlight: false,
      q: "",
    },
  });

  const submitForm = async (data) => {
    if (!data.q.trim()) {
      return;
    }

    let queryStringParts = [
      `title=${data.searchBy === "title"}`,
      data.geoLocation ? `geoLocation=${data.geoLocation}` : "",
      data.medium ? `medium=${data.medium}` : "",
      `isOnView=${data.isOnView}`,
      `isHighlight=${data.isHighlight}`,
      `q=${data.q}`,
    ];

    let queryString = queryStringParts.filter((part) => part !== "").join("&");

    router.push(`/artwork?${queryString}`);

    try {
      const updatedSearchHistory = await addToHistory(queryString);
      setSearchHistory(updatedSearchHistory);
    } catch (error) {
      console.error("Error updating search history:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Search Query</Form.Label>
            <Form.Control type="text" placeholder="" {...register("q")} />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Label>Search By</Form.Label>
          <Form.Select {...register("searchBy")} className="mb-3">
            <option value="title">Title</option>
            <option value="tags">Tags</option>
            <option value="artistOrCulture">Artist or Culture</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Geo Location</Form.Label>
            <Form.Control type="text" placeholder="" {...register("geoLocation")} />
            <Form.Text className="text-muted">
              Case Sensitive String (ie &quot;Europe&quot;, &quot;France&quot;, &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;, etc.), with multiple
              values separated by the | operator
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Medium</Form.Label>
            <Form.Control type="text" placeholder="" {...register("medium")} />
            <Form.Text className="text-muted">
              Case Sensitive String (ie: &quot;Ceramics&quot;, &quot;Furniture&quot;, &quot;Paintings&quot;, &quot;Sculpture&quot;, &quot;Textiles&quot;, etc.),
              with multiple values separated by the | operator
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Check label="Highlighted" {...register("isHighlight")} />
          <Form.Check label="Currently on View" {...register("isOnView")} />
        </Col>
      </Row>
      <Row>
        <Col>
          <br />
          <Button variant="secondary" type="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AdvancedSearch;
