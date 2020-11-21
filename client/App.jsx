import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import QAndA from './components/QAndA.jsx';
import ShippingAndReturns from './components/ShippingAndReturns.jsx';
import Details from './components/Details.jsx';
import styles from './assets/style.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      selected: 'details',
      showToggle: false,
      highlights: [],
      description: '',
      specifications: {},
      questions: [],
      questionCount: 0,
      answers: [],
      product: 1
    };

    // INITIAL API CALLS FOR DATA
  }
  componentDidMount() {
    this.getProductDetails();
    this.getQuestions();
  }

  // API CALLS
  getProductDetails() {
    axios({
      method: 'GET',
      url: `/api/products/${this.state.product}/details`
    })
      .then(result => {
        this.setState({
          description: result.data.description,
          highlights: result.data.highlights,
          specifications: result.data.specifications
        });
      }, (err) => {
        console.error(err);
      });
  }

  getQuestions() {
    axios({
      method: 'GET',
      url: `/api/products/${this.state.product}/questions`,
    })
      .then(results => {
        this.setState({
          questionCount: results.data.length,
          questions: results.data
        });
      }, (err) => {
        console.error(err);
      });
  }

  getAnswers() {
    axios({
      method: 'GET',
      url: `/api/products/${this.state.product}/answers`
    })
      .then(results => {
        this.setState({
          answers: results.data
        });
      }, (err) => {
        console.error(err);
      });
  }

  // HANDLERS
  handleClick(e) {
    document.getElementById(this.state.selected).classList.remove(`${styles.selected}`);

    document.getElementById('shipping-returns-container').classList.add(`${styles.displayNone}`);
    document.getElementById('details-container').classList.add(`${styles.displayNone}`);
    document.getElementById('q-and-a-container').classList.add(`${styles.displayNone}`);

    this.setState({
      selected: e.target.id
    }, ()=> {
      document.getElementById(this.state.selected).classList.add(`${styles.selected}`);
      if (this.state.selected === 'shipping') {
        document.getElementById('shipping-returns-container').classList.remove(`${styles.displayNone}`);
      }
      if (this.state.selected === 'details') {
        document.getElementById('details-container').classList.remove(`${styles.displayNone}`);
      }
      if (this.state.selected === 'q-and-a') {
        document.getElementById('q-and-a-container').classList.remove(`${styles.displayNone}`);
        this.getAnswers();
      }
    });
  }

  handleShowToggle() {
    var button = document.getElementById('btn expand');

    if (!this.state.showToggle) {
      return this.setState({
        showToggle: !this.state.showToggle
      }, () => {
        button.innerHTML = 'Show less';
      });
    }
    this.setState({
      showToggle: false
    }, () => {
      button.innerHTML = 'Show more';
    });
  }

  render() {
    return (
      <div id={styles.mainContainer}>
        <h2 id={styles.moduleTitle}>About this item</h2>
        <div id={styles.tabHeading}>
          <div className={styles.marginLeft}>
            <ul id={styles.tabList}>
              <li id="details" className={`${styles.tab} ${styles.details} ${styles.selected}`} onClick={this.handleClick}>Details</li>
              <li id="shipping" className={`${styles.tab} shipping`} onClick={this.handleClick}>Shipping & Returns</li>
              <li id="q-and-a" className={`${styles.tab} q-and-a`} onClick={this.handleClick}>Q&A ({this.state.questionCount})</li>
            </ul>
          </div>
        </div>
        <Details
          toggle={this.handleShowToggle.bind(this)}
          highlights={this.state.highlights}
          toggleStatus={this.state.showToggle}
          description={this.state.description}
          specifications={this.state.specifications}
        />
        <ShippingAndReturns specs={this.state.specifications}/>
        <QAndA
          questions={this.state.questions}
          answers={this.state.answers}
          questionCount={this.state.questionCount}
        />

      </div>
    );
  }
}

export default App;