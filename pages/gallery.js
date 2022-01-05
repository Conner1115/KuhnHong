import Head from 'next/head'
import cont from '../styles/cont.module.css';
import Nav from '../components/nav';
import styles from '../styles/pages/Gallery.module.css'
import { Component, createRef } from 'react';
import Script from 'next/script'

const Types = ["Previous Exhibitions", "Landscapes", "Portraits", "Figures", "Still Life"]
const fallbackData = (cat) => [{
  title: "Oh No!",
  image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=',
  description: "There are no " + Types[cat] + " paintings yet.",
  price: 0,
  topic: cat
}];

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      category: 0,
      data: fallbackData(0),
      allData: []
    }
    this.moveBy = this.moveBy.bind(this);
    this.sortCategories = this.sortCategories.bind(this);
  }
  moveBy(n) {
    let ind = this.state.index + n;
    if (ind >= this.state.data.length) {
      ind = 0;
    } else if (ind < 0) {
      ind = this.state.data.length - 1;
    }
    this.setState({
      index: ind
    })
  }
  sortCategories(e) {
    let cat = Number(e.target.value);
    let data = this.state.allData.filter(x => x.topic === cat);
    this.setState({
      index: 0,
      category: cat,
      data: data.length > 0 ? data : fallbackData(cat)
    })
  }
  componentDidMount() {
    fetch("/api/paintings").then(r => r.json()).then(data => {
      this.setState({
        allData: data
      })
      this.sortCategories({ target: { value: 0 } });
    })
  }
  render() {
    return (
      <div>
        <Head>
          <title>Gallery</title>
        </Head>

        <Script src="https://kit.fontawesome.com/5434134134.js"></Script>
        <section className={cont.relcont + " " + styles.gcont}>
          <div className={styles.core}>
            <div className={styles.sld}>
              <button onClick={() => this.moveBy(-1)} className={styles.slideBtn}><i className="fas fa-chevron-left"></i></button>
            </div>
            <div className={styles.centerCore} style={{ backgroundImage: `url(${this.state.data[this.state.index].image})` }}>

              <div className={styles.imageCover}>
                <div className={styles.centerCover}>
                  <h1 className={styles.imageTitle}>{this.state.data[this.state.index].title}</h1>
                  <p className={styles.imageDesc}>{this.state.data[this.state.index].description}</p>
                  <div className={styles.imageStats}>
                    {Types[this.state.data[this.state.index].topic]}{' • $'}{this.state.data[this.state.index].price}{' • '}{this.state.data[this.state.index].sold === undefined ? "Not available" : (this.state.data[this.state.index].sold ? "Sold" : "Available for Purchase")}
                  </div>
                </div>
              </div>

              <div className={styles.dots}>
                <select className={styles.sorter} onChange={this.sortCategories}>
                  {Types.map((t, ind) => <option key={ind} value={ind}>{t}</option>)}
                </select>
                <div style={{display: 'flex'}}>
                  {this.state.data.map((d, ind) => <div onClick={() => {
                    this.setState({
                      index: ind
                    })
                  }} className={`${styles.dot} ${ind === this.state.index && styles.dotSelected}`} key={ind}></div>)}
                </div>
              </div>
            </div>
            <div className={styles.sld}>
              <button onClick={() => this.moveBy(1)} className={styles.slideBtn}><i className="fas fa-chevron-right"></i></button>
            </div>
          </div>
        </section>

        <Nav />
      </div>
    );
  }
}
