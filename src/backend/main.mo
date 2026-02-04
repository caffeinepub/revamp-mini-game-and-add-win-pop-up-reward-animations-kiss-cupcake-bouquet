import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  type PictureId = Text;
  type MessageId = Text;

  public type Picture = {
    id : PictureId;
    blob : Storage.ExternalBlob;
    title : Text;
    description : Text;
    position : Nat;
  };

  public type Message = {
    id : MessageId;
    content : Text;
    position : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  // State
  var pictures = List.empty<Picture>();
  var messages = List.empty<Message>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Picture management (admin-only)
  public shared ({ caller }) func addPicture(blob : Storage.ExternalBlob, title : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can add pictures");
    };
    let position = pictures.size();
    let id = title.concat("_").concat(description); // Only take first 20 characters is removed
    pictures.add({
      id;
      blob;
      title;
      description;
      position;
    });
  };

  public shared ({ caller }) func updatePicture(id : PictureId, blob : Storage.ExternalBlob, title : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can update pictures");
    };
    pictures := pictures.map(func(pic) { if (pic.id == id) { { id; blob; title; description; position = pic.position } } else { pic } });
  };

  public shared ({ caller }) func deletePicture(id : PictureId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can delete pictures");
    };
    pictures := pictures.filter(func(picture) { picture.id != id });
  };

  public shared ({ caller }) func reorderPictures(orderedIds : [PictureId]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can reorder pictures");
    };
    var newPosition = 0;
    pictures := pictures.map(
      func(pic) {
        var pos = pic.position;
        for (i in orderedIds.keys()) {
          if (orderedIds[i] == pic.id) {
            pos := i;
          };
        };
        { id = pic.id; blob = pic.blob; title = pic.title; description = pic.description; position = pos };
      }
    );
  };

  // Message management (admin-only)
  public shared ({ caller }) func addMessage(content : Text, position : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can add messages");
    };
    let id = content.concat("_pos_").concat(Nat.toText(position)); // Only take first 10 characters is removed
    messages.add({
      id;
      content;
      position;
    });
  };

  public shared ({ caller }) func updateMessage(id : MessageId, content : Text, position : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can update messages");
    };
    messages := messages.map(func(msg) { if (msg.id == id) { { id; content; position } } else { msg } });
  };

  public shared ({ caller }) func deleteMessage(id : MessageId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can delete messages");
    };
    messages := messages.filter(func(message) { message.id != id });
  };

  public shared ({ caller }) func reorderMessages(orderedIds : [MessageId]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can reorder messages");
    };
    var newPosition = 0;
    messages := messages.map(
      func(msg) {
        var pos = msg.position;
        for (i in orderedIds.keys()) {
          if (orderedIds[i] == msg.id) {
            pos := i;
          };
        };
        { id = msg.id; content = msg.content; position = pos };
      }
    );
  };

  // Public queries for all users (including guests - no authentication required)
  public query func getPictures() : async [Picture] {
    pictures.toArray();
  };

  public query func getMessages() : async [Message] {
    messages.toArray();
  };
};
