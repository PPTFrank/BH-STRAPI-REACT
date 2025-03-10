import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Form,
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

const UpoloadAvatar = ({
  userId,
  token,
  username,
  avatarUrl,
  setisUserUpdated,
}) => {
  const [modal, setModal] = useState(false);
  const [file, setFile] = useState(null);

  const toggle = () => {
    setModal(!modal);
  };

  const handleFileChange = ({ target: { files } }) => {
    if (files?.length) {
      const { type } = files[0];
      if (type === "image/png" || type === "image/jpeg") {
        setFile(files[0]);
      } else {
        toast.error("Chỉ cho phép các loại hình ảnh png và jpeg*", {
          hideProgressBar: true,
        });
      }
    }
  };

  const upateUserAvatarId = async (avatarId, avatarUrl) => {
    try {
      await axios.put(
        `http://localhost:1337/api/users/${userId}`,
        { avatarId, avatarUrl },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
        }
      );
      setisUserUpdated(true);
    } catch (error) {
      console.log({ error });
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("File is required*", {
        hideProgressBar: true,
      });
      return;
    }

    try {
      const files = new FormData();
      files.append("files", file);
      files.append("name", `${username} avatar`);

      const {
        data: [{ id, url }],
      } = await axios.post(`http://localhost:1337/api/upload`, files, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `bearer ${token}`,
        },
      });
      upateUserAvatarId(id, url);
      setFile(null);
      setModal(false);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div>
      <Button size="sm" onClick={toggle}>
        {`${avatarUrl ? "Change" : "Tải ảnh"} lên`}
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`${
          avatarUrl ? "Change" : "Tải lên"
        } ảnh đại diện của bạn`}</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="exampleFile">Tệp ảnh</Label>
              <Input
                type="file"
                name="file"
                id="exampleFile"
                onChange={handleFileChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Tải lên
          </Button>
          <Button color="secondary" onClick={toggle}>
            Huỷ
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UpoloadAvatar;
