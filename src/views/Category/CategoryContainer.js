import React, { Component, createRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../helpers/api';
import Category from './Category';

class CategoryContainer extends Component {
  state = {
    category: null,
    currentQuestionIndex: 0,
    score: 0
  }

  // createRef in order to bring back input value to its parent
  answerInput = createRef();

  // async needed when using promise
  async componentDidMount() {
    const data = await api.getCategoryById(this.props.match.params.id);
    console.log(data.clues.map(item => item.answer))
    // stored response in the state;
    this.setState({
      category: data,
      currentQuestionIndex: Number(localStorage[`${data.id}-questionIndex`]) || 0,
      score: Number(localStorage[`${data.id}-score`]) || 0
    });
    window.aaa = this.state;
  }

  handleSubmit = async (e) => {
    // here I prevent the default bh of submitting form
    e.preventDefault();
    const currentQuestionIndex = this.state.currentQuestionIndex;
    const expectedAnswer = this.state.category.clues[currentQuestionIndex].answer.toLowerCase()
    const answerInput = this.answerInput.current;
    const givenAnswer = answerInput.value.toLowerCase();
    const newQuestionIndex = currentQuestionIndex + 1

    // if answer is right, increment score
    if (expectedAnswer === givenAnswer) {
      console.log('next');
      await this.setState({
        score: this.state.score + 10
      }, () => {
        localStorage[`${this.state.category.id}-score`] = this.state.score;
      });
    } else {
      console.log('noo');
    }


    // go to the next question
    localStorage[`${this.state.category.id}-questionIndex`] = newQuestionIndex;
    this.setState({ currentQuestionIndex: newQuestionIndex });
    answerInput.value = '';

    // write logic to handle good/bad answer
    // increment currentQuestionIndex
    // save in the storage the id of the question
    // if no more question, remove category from categories playable
    // increment score somewhere and redirect to /

    // check if answer is equal to the requested answer from the current question
  }

  render() {
    const { category, currentQuestionIndex, score } = this.state;
    // at first render, category will be null so we need to wait
    // before using data.
    if (!category) return <div>is loading</div>
    if (currentQuestionIndex >= category.clues.length) return (
      <div>
        <p>You already finished this category with a score of {score}</p>
        <Link to={`/`} key={category.id}>Go back to category list</Link>
      </div>
    )

    return (
      <Category
        category={category}
        currentQuestionIndex={currentQuestionIndex}
        score={score}
        handleSubmit={this.handleSubmit}
        // plug createRef to chidlren
        answerInput={this.answerInput}
      />
    );
  }
}

export default CategoryContainer;