import React, { Component, createRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../helpers/api';
import Category from './Category';
import tools from '../../helpers/tools';

class CategoryContainer extends Component {
  state = {
    category: null,
    currentQuestionIndex: 0,
    score: 0,
    maxScore: 0,
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
      maxScore: data.clues.length * 10,
      lives: lives !== undefined ? Number(lives) : this.state.defaults.lives
    });
    window.aaa = this.state;
  }

  handleSubmit = (e) => {
    const currentQuestionIndex = this.state.currentQuestionIndex;
    const expectedAnswer = this.state.category.clues[currentQuestionIndex].answer.toLowerCase()
    const answerInput = this.answerInput.current;
    const givenAnswer = answerInput.value.toLowerCase();

    e.preventDefault();

    // if answer is right, increment score
    if (expectedAnswer === givenAnswer) {
      tools.incrementCategoryData(this, 'score', 10);
    } else {
      tools.incrementCategoryData(this, 'lives', -1);
    }

    // go to the next question
    tools.incrementCategoryData(this, 'currentQuestionIndex', this.state.lives === 0 ? 0 : 1)
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
    const { category, currentQuestionIndex, score, maxScore, lives } = this.state;
    // default display until data is available
    if (!category) return <div>is loading</div>

    // display when game over
    if (!lives) {
      return (
        <div>
          <p>Game Over! 0 li{lives > 1 ? 'ves' : 'fe'} left.</p>
          <p>Score: {score}</p>
          <button type="button" onClick={this.resetCategory}>Reset category</button>
        </div>
      )
    }

    // display when category has already been finished
    if (currentQuestionIndex >= category.clues.length) return (
      <div>
        <p>You finished this category with a score of {score} and {lives} li{lives > 1 ? 'ves' : 'fe'}.</p>
        { score === maxScore && <p>You're a winner!</p> }
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
        lives={lives}
        handleSubmit={this.handleSubmit}
        // plug createRef to chidlren
        answerInput={this.answerInput}
      />
    );
  }
}

export default CategoryContainer;