import { model, Schema } from 'mongoose';

interface Sample {
    id: number;
    isActive: boolean;
    isDeleted: boolean;
    timeStamp: number;
    createdOn: Date;
    updatedOn: Date;
}

const SampleSchema = new Schema<Sample>({
    id: {
        type: Number,
        required: true,
        unique: true,
        default: 0,
    },

    // Model Required fields
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    timeStamp: {
        type: Number,
        required: true,
        default: () => Date.now(),
    },
    createdOn: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
    updatedOn: {
        type: Date,
        required: true,
        default: () => new Date(),
    },
});

model<Sample>('Sample', SampleSchema);
