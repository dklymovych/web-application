import os
import sys
import gridfs
import subprocess
import tempfile
import pika
import time
import bson
from pymongo import MongoClient


client = MongoClient("localhost", 27017)
db = client.db

fs = gridfs.GridFS(db)
tasks = db.tasks

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()


def run_command(cmd):
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE)

    while True:
        line = process.stdout.readline().rstrip()

        if not line:
            break

        yield int(line.decode('utf-8'))


def run_task(task_id, n_threads=1):
    try:
        current_task = tasks.find_one({"_id": task_id})
        input_id = current_task.get("input_id")
    except Exception:
        return

    with tempfile.NamedTemporaryFile(delete=False) as input_file:
        input_file.write(fs.get(input_id).read())

    with tempfile.NamedTemporaryFile(delete=False) as output_file:
        pass

    cmd = ["./algorithm/build/pathfinding", "-t", f"{n_threads}", "-o", output_file.name, input_file.name]
    task_exists = True
    prev_progress = 0

    for progress in run_command(cmd):
        if progress > prev_progress:
            prev_progress = progress
            task_exists = tasks.find_one({"_id": task_id}) is not None

            if not task_exists:
                break

            tasks.update_one({"_id": task_id}, {"$set": {"progress": progress}})

    if task_exists:
        with open(output_file.name, "rb") as file:
            output_id = fs.put(file.read())

        tasks.update_one({"_id": task_id}, {"$set": {"output_id": output_id}})

    os.remove(input_file.name)
    os.remove(output_file.name)


def callback(ch, method, properties, body):
    print(f" [x] Received {body.decode()}")
    time.sleep(1)
    ch.basic_ack(delivery_tag=method.delivery_tag)

    n_threads = sys.argv[1]
    run_task(bson.ObjectId(body.decode()), n_threads)


def main():
    try:
        channel.queue_declare(queue='task_queue', durable=True)
        print(' [*] Waiting for tasks. To exit press CTRL+C')

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue='task_queue', on_message_callback=callback)

        channel.start_consuming()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
