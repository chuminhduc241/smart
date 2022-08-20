import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CategoryService } from "../../services/category-service";
import { Accordion, AccordionTab } from "primereact/accordion";
import "./nav.scss";

const Nav = () => {
  const [categories, setCategories] = useState([]);

  const categoryService = new CategoryService();

  useEffect(() => {
    const getCates = async () => {
      try {
        const categories = await categoryService.getCategory();
        setCategories(categories);
      } catch (error) {
        console.log(error);
      }
    };
    getCates();
  }, []);
  if (categories.length > 0) {
    categories.map((e) => {
      e.subCategoriesName = e.subCategories?.split(", ") || [];
      return e;
    });
  }

  return (
    <div className="wrap_main">
      <div className="grid wide">
        <div className="row">
          <div className="col l-3 c-12 m-12">
            <div className="menu_mega">
              <div className="title_menu">
                <span className="title">Danh mục sản phẩm</span>
                <span className="nav_button">
                  <span>
                    <i className="fa-solid fa-bars"></i>
                  </span>
                </span>
                <ul className="tab-menu">
                  {categories &&
                    categories.map((item) => (
                      <li key={item._id}>
                        <Accordion>
                          <AccordionTab header={item.name}>
                            {item.subCategoriesName.length > 0 &&
                              item.subCategoriesName.map((k, index) => (
                                <ul key={index}>
                                  <li>
                                    <Link to={`/list-products?category=${k}`}>
                                      {k}
                                    </Link>
                                  </li>
                                </ul>
                              ))}
                          </AccordionTab>
                        </Accordion>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <nav className="col l-9 hidden-md">
            <ul className="item_big">
              <li className="nav-item active">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="nav-item">
                <Link to="/list-products?category=HP">MÁY TÍNH HP</Link>
              </li>
              <li className="nav-item">
                <Link to="/list-products?category=DELL">MÁY TÍNH DELL</Link>
              </li>
              <li className="nav-item">
                <Link to="/list-products?category=ACER">MÁY TÍNH ACER</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact">Liên hệ</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Nav;
