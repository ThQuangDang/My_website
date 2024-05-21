import React, {useState} from "react";

function TypeMessage(props) {
  const { onSubmit } = props;
  const [value, setValue] = useState("");
  const [image, setImage] = useState(null);

  const handleValueChange = (e) => {
    setValue(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    setImage(file);
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!onSubmit) return;

    if (image) {
      onSubmit(image); // Truyền đường dẫn của hình ảnh thay vì object FormData
      setImage(null);
    } else if (value !== "") {
      onSubmit(value);
      setValue("");
    }
  };
  return (
    <div>
      <form onSubmit={handleFormSubmit} className="chatuser-typemessage" enctype="multipart/form-data">
        <input
          placeholder="Type a message"
          type="text"
          value={value}
          onChange={handleValueChange}
        />
        <input type="file" name="image" onChange={handleImageChange} />

        <button type="submit">Gửi</button>
      </form>
    </div>
  );
}

export default TypeMessage;
