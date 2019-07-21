// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var blub_pb = require('./blub_pb.js');

function serialize_blub_GiveMeABlubReply(arg) {
  if (!(arg instanceof blub_pb.GiveMeABlubReply)) {
    throw new Error('Expected argument of type blub.GiveMeABlubReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_blub_GiveMeABlubReply(buffer_arg) {
  return blub_pb.GiveMeABlubReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_blub_GiveMeABlubRequest(arg) {
  if (!(arg instanceof blub_pb.GiveMeABlubRequest)) {
    throw new Error('Expected argument of type blub.GiveMeABlubRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_blub_GiveMeABlubRequest(buffer_arg) {
  return blub_pb.GiveMeABlubRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// The greeting service definition.
var BlubberService = exports.BlubberService = {
  // Sends a greeting
  giveMeABlub: {
    path: '/blub.Blubber/GiveMeABlub',
    requestStream: false,
    responseStream: false,
    requestType: blub_pb.GiveMeABlubRequest,
    responseType: blub_pb.GiveMeABlubReply,
    requestSerialize: serialize_blub_GiveMeABlubRequest,
    requestDeserialize: deserialize_blub_GiveMeABlubRequest,
    responseSerialize: serialize_blub_GiveMeABlubReply,
    responseDeserialize: deserialize_blub_GiveMeABlubReply,
  },
};

exports.BlubberClient = grpc.makeGenericClientConstructor(BlubberService);
