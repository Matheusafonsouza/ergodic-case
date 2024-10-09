# ergodic-case

## HOW TO RUN

### Backend
```
cd backend
make install
make run
```

#### Backend routes

##### /graph

Returns graph

##### /entities

Return list of entities for a given type

Path params: type

##### /edges

Return list of edges for a given source and relationship

Query params: type and source

##### /path

Return all paths from source to target (only ids)

Query params: source and target

##### /messages

Return all messages

Query params: entity (optional)

### Frontend
```
cd frontend
npm install
npm run dev
```

## BACKEND QUESTION

To do this, I would divide this task into different stages:

1 - the first task will receive the question and the graph and will, from both, generate a task id that will be stored in a database (for future retrieval of the operation status) and send a payload containing the question and the graph to a queue that will be consumed asynchronously.

2 - a second task will consume the previously mentioned queue and perform the necessary operations without using the resources of the API that sent the message to the queue, thus avoiding bottlenecks for direct users of the main API. This second task will be able to receive the data either from the payload sent or from external storage (let's say the graph is very large, so we'll have to save it in some external storage such as a bucket and retrieve this data in our task).

3 - at the end of the second task, after all the processing has been done, the task will save the question data and update the database status for the given task id. After this, we will notify the main API via a webhook (or any communication mechanism) that the second task has finished and that the requesting user can be notified with the answer to their question.

```python
def my_heavy_task(question: str, graph: GraphModel) -> str:
    task_id = generate_task_id()
    send_to_queue({
        "question": question,
        "graph": graph,
        "task_id": task_id,
    })
    return {
        "status": "pending",
        "task_id": task_id,
    }
``` 

## FRONTEND QUESTION

To display the graph data, in addition to rendering the graph on the page itself, we could highlight the entities within the messages (thus making a parallel with the entity being represented and its data).

We can also use a common structure to render boxes that will show the data of a given entity and the other related entities, as if it were an admin page to render user data and their posts.
