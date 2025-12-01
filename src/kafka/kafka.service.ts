import { Injectable, OnModuleInit } from "@nestjs/common";
import { Consumer, Kafka, Producer } from "kafkajs";

@Injectable()
export class KafkaService implements OnModuleInit{
    private readonly kafka = new Kafka({
        clientId: 'college_admin',
        brokers: ['localhost:9092'],
    });
    private producer: Producer;
    private consumer: Consumer;

    async onModuleInit() {
        this.producer = this.kafka.producer();
        await this.producer.connect();

        this.consumer = this.kafka.consumer({groupId: 'college-group'});
        await this.consumer.connect();

        await this.consumer.subscribe({topic: 'student-created'});

        await this.consumer.run({
            eachMessage: async({message})=>{
                console.log(`Received: ${message.value?.toString()}`);
            },
        });
    }


    async sendMessage(topic: string, message: any){
        return this.producer.send({
            topic,
            messages: [{value: JSON.stringify(message)}],
        });
    }
}