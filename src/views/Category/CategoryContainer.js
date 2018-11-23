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
    const category = await api.getCategoryById(this.props.match.params.id);
    const categoryId = category.id
    const currentQuestionIndex = tools.getLocalValue(this, 'currentQuestionIndex', categoryId);
    const score = tools.getLocalValue(this, 'score', categoryId);
    const lives = tools.getLocalValue(this, 'lives', categoryId);

    console.log(category.clues.map(item => item.answer));
    this.setState({
      category,
      maxScore: category.clues_count * 10
    });
    tools.updateAndPersist(this, 'currentQuestionIndex', currentQuestionIndex)
    tools.updateAndPersist(this, 'score', score);
    tools.updateAndPersist(this, 'lives', lives);
    window.aaa = this.state;
  }

  handleSubmit = (e) => {
    const currentQuestionIndex = this.state.currentQuestionIndex;
    const expectedAnswer = this.state.category.clues[currentQuestionIndex].answer.toLowerCase()
    const answerInput = this.answerInput.current;
    const givenAnswer = answerInput.value.toLowerCase();
    const newQuestionIndex = this.state.lives === 0
      ? this.state.currentQuestionIndex
      : this.state.currentQuestionIndex + 1

    e.preventDefault();

    // if answer is right, increment score
    if (expectedAnswer === givenAnswer) {
      tools.updateAndPersist(this, 'score', this.state.score + 10);
    } else {
      tools.updateAndPersist(this, 'lives', this.state.lives - 1);
    }

    // go to the next question
    tools.updateAndPersist(this, 'currentQuestionIndex', newQuestionIndex)
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
          <Link to={`/`} key={category.id}>Go back to category list</Link>
        </div>
      )
    }

    // display when category has already been finished
    if (currentQuestionIndex >= category.clues_count) return (
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