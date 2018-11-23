import React, { Component, createRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../helpers/api';
import Category from './Category';

class CategoryContainer extends Component {
  state = {
    category: null,
    currentQuestionIndex: 0,
    score: 0,
    lives: 3,
    defaults: {
      currentQuestionIndex: 0,
      score: 0,
      lives: 3
    }
  }

  // createRef in order to bring back input value to its parent
  answerInput = createRef();

  // async needed when using promise
  async componentDidMount() {
    const data = await api.getCategoryById(this.props.match.params.id);
    const currentQuestionIndex = localStorage[`${data.id}-currentQuestionIndex`]
    const score = localStorage[`${data.id}-score`]
    const lives = localStorage[`${data.id}-lives`]

    console.log(data.clues.map(item => item.answer))
    this.setState({
      category: data,
      currentQuestionIndex: currentQuestionIndex !== undefined ? Number(currentQuestionIndex) : this.state.defaults.currentQuestionIndex,
      score: score !== undefined ? Number(score) : this.state.defaults.score,
      lives: lives !== undefined ? Number(lives) : this.state.defaults.lives
    });
    window.aaa = this.state;
  }

  handleSubmit = (e) => {
    const currentQuestionIndex = this.state.currentQuestionIndex;
    const expectedAnswer = this.state.category.clues[currentQuestionIndex].answer.toLowerCase()
    const answerInput = this.answerInput.current;
    const givenAnswer = answerInput.value.toLowerCase();
    const newQuestionIndex = currentQuestionIndex + 1

    e.preventDefault();

    // if answer is right, increment score
    if (expectedAnswer === givenAnswer) {
      this.setState({
        score: this.state.score + 10
      }, () => {
        localStorage[`${this.state.category.id}-score`] = this.state.score;
      });
    } else {
      this.setState({
        lives: this.state.lives - 1
      }, () => {
        localStorage[`${this.state.category.id}-lives`] = this.state.lives;
      })
    }

    // go to the next question
    if (this.state.lives === 0) {
      newQuestionIndex = 0;
    }
    localStorage[`${this.state.category.id}-currentQuestionIndex`] = newQuestionIndex;
    this.setState({ currentQuestionIndex: newQuestionIndex });
    answerInput.value = '';
  }

  resetCategory = () => {
    const categoryId = this.state.category.id
    const { currentQuestionIndex, score, lives} = this.state.defaults

    this.setState({
      currentQuestionIndex,
      score,
      lives
    });
    localStorage[`${categoryId}-score`] = score;
    localStorage[`${categoryId}-lives`] = lives;
    localStorage[`${categoryId}-currentQuestionIndex`] = currentQuestionIndex;
  }

  render() {
    const { category, currentQuestionIndex, score, lives } = this.state;
    // default display until data is available
    if (!category) return <div>is loading</div>

    // display when game over
    if (!lives) {
      return (
        <div>
          <p>Game Over!</p>
          <p>Score: {score}</p>
          <button type="button" onClick={this.resetCategory}>Reset category</button>
        </div>
      )
    }

    // display when category has already been finished
    if (currentQuestionIndex >= category.clues.length) return (
      <div>
        <p>You already finished this category with a score of {score}</p>
        <button type="button" onClick={this.resetCategory}>Reset category</button>
        <Link to={`/`} key={category.id}>Go back to category list</Link>
      </div>
    )

    // display when category is available
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