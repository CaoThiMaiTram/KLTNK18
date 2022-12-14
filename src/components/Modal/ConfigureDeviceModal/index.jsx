import React, { useState } from "react";

import CusModal from "..";

import { Button, Select, Checkbox, Row, Col, InputNumber } from "antd";
import "./styles.scss";

import { useDispatch } from "react-redux";
import { updateObjectThunk } from "../../../redux/slices/objectSlice";
import Input from "antd/lib/input/Input";

const { Option } = Select;

const CheckboxGroup = Checkbox.Group;
const serviceOptions = ["MySQL", "HTTP", "DNS", "FTP"];
const osList = ["Ubuntu", "Alpine", "Kali"];
const subnetList = ["255.255.255.0(/24)"];

const ConfigureDeviceModal = ({ isModalOpen, setIsModalOpen, data }) => {
  const dispatch = useDispatch();
  //OS State
  const [osValue, setOSValue] = useState(
    data.configure.os ? data.configure.os : "ubuntu"
  );
  // Subnet State
  const [subnetValue, setSubnetValue] = useState(
    data.configure.subnet ? data.configure.subnet : subnetList[0]
  );
  // Services State
  const [checkedList, setCheckedList] = useState(
    data.configure.services ? data.configure.services : []
  );
  // IP State
  const [IPList, setIPList] = useState(
    data.configure.IP ? data.configure.IP : [null, null, null, null]
  );
  // Port State
  const [PortList, setPortList] = useState(
    data.configure.Port ? data.configure.Port : ["3306", "80", "53", "21"]
  );
  // Path
  const [filePath, setPath] = useState(
    data.configure.Path ? data.configure.Path : ""
  );
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOSChange = (value) => {
    setOSValue(value);
  };

  const handleSubChange = (value) => {
    setSubnetValue(value);
  };

  const handlePathChange = (value) => {
    setPath(value);
  };

  const handleIPChange = (value, index) => {
    const newList = [...IPList];
    newList[index] = value;
    setIPList(newList);
  };
  const handlePortChange = (value, index) => {
    const newList = [...PortList];
    newList[index] = value;
    setPortList(newList);
  };

  const handleSave = () => {
    dispatch(
      updateObjectThunk({
        id: data.id,
        configure: {
          os: osValue,
          services: checkedList,
          subnet: subnetValue,
          IP: IPList,
          Port:PortList,
        },
      })
    );
    handleCancel();
  };

  // Handle Services list change
  const onChange = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < serviceOptions.length);
    setCheckAll(list.length === serviceOptions.length);
  };
  // Check all Services
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? serviceOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <CusModal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      title="Configure"
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <div className="configure-modal">
        {/* OS Section */}
        <div className="configure-modal__section">
          <h3>OS:</h3>
          <Select
            defaultValue={osValue}
            style={{
              width: 120,
            }}
            onChange={handleOSChange}
          >
            {osList.map((os) => (
              <Option value={os.toLowerCase()} key={os}>
                {os}
              </Option>
            ))}
          </Select>
        </div>

        {/* IP Section */}
        <div className="configure-modal__section">
          <h3>IP Address:</h3>
          <InputNumber
            style={{ width: "60px" }}
            min={1}
            max={254}
            onChange={(value) => {
              handleIPChange(value, 0);
            }}
          />
          .
          <InputNumber
            style={{ width: "60px" }}
            min={0}
            max={255}
            onChange={(value) => {
              handleIPChange(value, 1);
            }}
          />
          .
          <InputNumber
            style={{ width: "60px" }}
            min={0}
            max={255}
            onChange={(value) => {
              handleIPChange(value, 2);
            }}
          />
          .
          <InputNumber
            style={{ width: "60px" }}
            min={1}
            max={253}
            onChange={(value) => {
              handleIPChange(value, 3);
            }}
          />
        </div>

        {/* Subnet Section */}
        <div className="configure-modal__section">
          <h3>Subnet Mask:</h3>
          <Select
            defaultValue={subnetValue}
            style={{
              width: "auto",
            }}
            onChange={handleSubChange}
          >
            {subnetList.map((subnet) => (
              <Option value={subnet.toLowerCase()} key={subnet}>
                {subnet}
              </Option>
            ))}
          </Select>
        </div>

        {/* Service Section */}
        <div className="configure-modal__service">
          <div className="configure-modal__service--header">
            <h3>Service</h3>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              Choose All
            </Checkbox>
            
        </div>
        <div className="configure-modal__service--checkbox-gr">
          <CheckboxGroup value={checkedList} onChange={onChange}>
             <Row gutter={[16, 16]}>
               {serviceOptions.map((service) => (
                <Col span={12} key={service}>
                  <Checkbox style={{ width: "75px" }} value={service}>{service}</Checkbox>
                  <InputNumber
                    style={{ width: "130px" }} 
                    placeholder="Port Number"
                    min={0}
                    onChange={(value) => {
                      var index = 0;
                      if (service === "HTTP")
                        index = 1;
                      if (service === "DNS")
                        index = 2;
                      if (service === "FTP")
                        index = 3;
                      handlePortChange(value.toString(), index);
                    }}
                  />    
                </Col> 
              ))}
            </Row>

            {/*<Row gutter={[16, 16]}>
              <h3>Path file copy to volume</h3>  
                <Input 
                  type="text"
                  name="txt"
                  style={{ width: "430px" }} 
                  placeholder="Path to file" 
                  onChange={(value) => {
                    handlePathChange(value);
                  }}
                ></Input>
            </Row>*/}
          </CheckboxGroup>
          </div>
        </div>
      </div>
    </CusModal>
  );
};

export default ConfigureDeviceModal;
