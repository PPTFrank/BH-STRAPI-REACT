import React, { useState } from "react";
import { Col, Row, Button, FormGroup, Input } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { storeUser } from "../../helpers";

const initialUser = { password: "", identifier: "" };

const Login = () => {
  const [user, setUser] = useState(initialUser);
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUser((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    const url = `http://localhost:1337/api/auth/local`;
    try {
      if (user.identifier && user.password) {
        const { data } = await axios.post(url, user);
        if (data.jwt) {
          storeUser(data);
          toast.success("Logged in successfully!", {
            hideProgressBar: true,
          });
          setUser(initialUser);
          navigate("/");
          window.location.reload();
        }
      }
    } catch (error) {
      toast.error(error.message, {
        hideProgressBar: true,
      });
    }
  };

  return (
    <Row className="login">
      <Col sm="12" md={{ size: 4, offset: 4 }}>
        <div>
          <h2>Nhập thông tin đăng nhập:</h2>
          <FormGroup>
            <Input
              type="email"
              name="identifier"
              value={user.identifier}
              onChange={handleChange}
              placeholder="Nhập email"
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
            />
          </FormGroup>
          <Button color="primary" onClick={handleLogin}>
            Đăng nhập
          </Button>
          <h6>
            Nhấn <Link to="/registration">vào đây</Link> để đăng ký
          </h6>
        </div>
      </Col>
    </Row>
  );
};

export default Login;
