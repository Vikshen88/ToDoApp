import React, {Component} from "react";
import AppHeader from "../app-header";
import ToDoList from "../todo-list";
import SearchPanel from "../search-panel";
import ItemStatusFilter from "../item-status-filter";
import ItemAddForm from "../item-add-form";
import "./app.css"

export default  class App extends Component{

    //Поле класса
    maxId = 100;

    state = {
        todoData: [
            {id:1,label: 'Drink coffee', important: false, done: false},
            {id:2,label: 'Make awesome app', important: true, done:false},
            {id:3,label: 'Have a lunch', important: false, done:false},
        ],
        term: '',
        filter: 'active' //active, all, done
    };

    onToggleDone = (id) => {
        this.setState(({todoData}) => {
            //update object
            const idx = todoData.findIndex((el) => el.id ===id);
            const oldItem = todoData[idx];
            const newItem = {...oldItem, done: !oldItem.done};
            //
            const before = todoData.slice(0, idx);
            const after = todoData.slice(idx+1);
            const newArray = [
                ...before,
                newItem,
                ...after];
            return {
                todoData: newArray
            }
        })
    };

    onToggleImportant = (id) => {
      console.log('Toggle important', id);
    };

    deleteItem = (id) => {
      this.setState(({ todoData }) => {
          const idx = todoData.findIndex((el) => el.id === id);
          // [a, b, c, d, e]
          //[a, b,  d, e]
          const before = todoData.slice(0, idx);
          const after = todoData.slice(idx+1);
          const newArray = [...before, ...after];
          return {
              todoData: newArray
          };
      });
    };

    addItem = (text) => {
        const newItem = {
            label: text,
            important: false,
            done: false,
            id: this.maxId++
        };

        this.setState(({todoData}) => {
            const newArray = [
                ...todoData,
                newItem
            ];
            return {
                todoData:newArray
            }
        });
    };

    search = (items, term) => {
        if(term.length === 0){
            return items;
        }
        return items.filter((item) => {
            return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
        });
    };

    onSearchChange = (term) => {
        this.setState({ term })
    };

    filter(items, filter) {
        switch (filter) {
            case 'all': return items;
            case 'active': return items.filter((item) => !item.done);
            case 'done': return items.filter((item) => item.done);
            default: return items;
        }
    };

    onFilterChange = (filter) => {
      this.setState({ filter });
    };

    render() {
        const  {todoData, term, filter} = this.state;
        const visibleItems = this.filter(this.search(todoData, term), filter);
        return (
            <div className="todo-app">
                <AppHeader toDo={1} done={3} />
                <div className="top-panel d-flex">
                    <SearchPanel
                        onSearchChange={this.onSearchChange}/>
                    <ItemStatusFilter
                        filter={filter}
                        onFilterChange={this.onFilterChange}/>
                </div>
                <ToDoList
                    todos={visibleItems}
                    onDeleted={ this.deleteItem }
                    onToggleImportant={ this.onToggleImportant}
                    onToggleDone={ this.onToggleDone}/>
                 <ItemAddForm onAddItem={ this.addItem }/>
            </div>
        )
    }
};

