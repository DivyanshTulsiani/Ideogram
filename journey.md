## These list down my learnings along while building this project
1. Use State and Use Effect 
2. comp test endpoint user clicks generate triggering generate function this returns json data from be with ndoes and edges this then goes in to usestate triggering a re render

3. Next learning is about handling input well to handle a input in react we must make the inout inside a state component just simply getting it data as we used to to in vanilla by input.html is not right as input comp might rerender since it was not a state var react would just think it is empty and at each rerender it would appear empty even when user types something
4. this input element is then mapped upon an onchange handler as soon as my input changes it changes my state component then i can this value for any purpose