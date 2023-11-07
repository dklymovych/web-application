import amqp from 'amqplib/callback_api'

export function new_task(task_id: string) {
  amqp.connect(process.env.RABBITMQ_URI, (error0, connection) => {
    if (error0) {
      throw error0
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1
      }

      var queue = 'task_queue'

      channel.assertQueue(queue, {
        durable: true
      })

      channel.sendToQueue(queue, Buffer.from(task_id), {
        persistent: true
      })

      console.log(" [x] Sent '%s'", task_id)
    })

    setTimeout(function() {
      connection.close()
    }, 500);
  })
}
