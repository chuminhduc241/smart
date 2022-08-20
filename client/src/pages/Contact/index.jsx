import React from "react";
import Breadcrumb from "../../components/BreadCrumb";

import "./style.scss";

const Contact = () => {
  return (
    <>
      <div className="grid wide pt-2 pb-2 mb-4 border-bottom">
        <Breadcrumb value="Liên hệ" />
      </div>
      <div className="contact">
        <div className="grid wide">
          <h3 className="title-head">Liên hệ</h3>
          <p>Mọi thắc mặc liên hệ qua hotline: 0397290976</p>
        </div>
      </div>
    </>
  );
};

export default Contact;
