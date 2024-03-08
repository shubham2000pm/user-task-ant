import React, { useState, useEffect } from "react";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { Input } from "antd";

const Search = ({ data, setFilteredData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  //   const [previousData, setPreviousData] = useState([]);

  //   useEffect(() => {
  //     setPreviousData(data);
  //   }, [data]);

  const clear = () => {
    setSearchTerm("");
    setFilteredData(data);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);

    if (value === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (item) =>
          item.id.toString().includes(value.toString()) ||
          item.userId.toString().includes(value.toString()) ||
          item.title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  return (
    <>
      <div>
        <Input
          style={{ maxWidth: "70%", marginBottom: "2em" }}
          prefix={<SearchOutlined />}
          placeholder="Search"
          suffix={searchTerm && <CloseOutlined onClick={clear} />}
          value={searchTerm}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>
    </>
  );
};

export default Search;
