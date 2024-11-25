import React, { Component } from 'react';
import NavbarComponent from './components/NavbarComponent';
import { Row, Col } from 'react-bootstrap';
import ListCategories from './components/ListCategories';
import Hasil from './components/Hasil';
import Menus from './components/Menus';
import { API_URL } from './utils/constants';
import axios from 'axios';
import swal from 'sweetalert';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menus: [],
      categoriYangDipilih: 'Makanan',
      keranjangs: []
    };
  }

  componentDidMount() {
    this.getMenusByCategory(this.state.categoriYangDipilih);
  }

  getMenusByCategory = (category) => {
    axios
      .get(`${API_URL}products?category.nama=${category}`)
      .then((res) => {
        this.setState({ menus: res.data });
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  changeCategory = (category) => {
    console.log("Category Selected:", category);
    this.setState({ categoriYangDipilih: category, menus: [] });
    this.getMenusByCategory(category);
  };

  masukKeranjang = (menu) => {
    console.log("Menu Added to Cart:", menu);
    this.setState(
      (prevState) => ({
        keranjangs: [...prevState.keranjangs, menu]
      }),
      () => {
        swal({
          title: "Sukses Masuk Keranjang",
          text: `Sukses Masuk Keranjang ${menu.nama}`,
          icon: "success",
          button: "OK"
        });

        axios
          .post("http://localhost:3004/keranjangs", {
            product: menu,
            jumlah: 1, 
            total_harga: menu.harga 
          })
          .then((response) => {
            console.log("Produk berhasil ditambahkan ke keranjang di JSON Server", response.data);
          })
          .catch((error) => {
            console.error("Error menambahkan produk ke keranjang JSON Server", error);
          });
      }
    );
  };

  render() {
    const { menus, categoriYangDipilih } = this.state;

    return (
      <div className="App">
        <NavbarComponent />
        <Row>
          <Col md={2}>
            <ListCategories
              changeCategory={this.changeCategory}
              categoriYangDipilih={categoriYangDipilih}
            />
          </Col>
          <Col md={7}>
            <h4>
              <strong>Daftar Produk</strong>
            </h4>
            <hr />
            <Row>
              {menus.map((menu) => (
                <Menus
                  key={menu.id}
                  menu={menu}
                  masukKeranjang={this.masukKeranjang}
                />
              ))}
            </Row>
          </Col>
          <Col md={3}>
            <Hasil />
          </Col>
        </Row>
      </div>
    );
  }
}
