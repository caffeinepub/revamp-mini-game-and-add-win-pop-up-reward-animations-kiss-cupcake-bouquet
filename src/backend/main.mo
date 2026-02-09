import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  type PictureId = Text;
  type MessageId = Text;
  type TreatId = Text;

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

  public type SweetTreat = {
    id : TreatId;
    name : Text;
    description : Text;
    position : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  // State
  var pictures = List.empty<Picture>();
  var messages = List.empty<Message>();
  var sweetTreats = List.empty<SweetTreat>();
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
    let id = title.concat("_").concat(description);
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
    let id = content.concat("_pos_").concat(position.toText());
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

  // Sweet treat management (admin-only)
  public shared ({ caller }) func addSweetTreat(name : Text, description : Text, position : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can add sweet treats");
    };
    let id = name.concat("_pos_").concat(position.toText());
    sweetTreats.add({
      id;
      name;
      description;
      position;
    });
  };

  public shared ({ caller }) func updateSweetTreat(id : TreatId, name : Text, description : Text, position : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can update sweet treats");
    };
    sweetTreats := sweetTreats.map(func(treat) { if (treat.id == id) { { id; name; description; position } } else { treat } });
  };

  public shared ({ caller }) func deleteSweetTreat(id : TreatId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can delete sweet treats");
    };
    sweetTreats := sweetTreats.filter(func(treat) { treat.id != id });
  };

  public shared ({ caller }) func reorderSweetTreats(orderedIds : [TreatId]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can reorder sweet treats");
    };
    sweetTreats := sweetTreats.map(
      func(treat) {
        var pos = treat.position;
        for (i in orderedIds.keys()) {
          if (orderedIds[i] == treat.id) {
            pos := i;
          };
        };
        { id = treat.id; name = treat.name; description = treat.description; position = pos };
      }
    );
  };

  // Unlock system
  type UnlockCount = {
    treats : Nat;
    messages : Nat;
    pictures : Nat;
  };

  let unlockCounts = Map.empty<Principal, UnlockCount>();

  public shared ({ caller }) func incrementUnlocks(unlockTreats : Bool, unlockMessages : Bool, unlockPictures : Bool) : async UnlockCount {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlock treats");
    };

    let currentCount = switch (unlockCounts.get(caller)) {
      case (null) { { treats = 0; messages = 0; pictures = 0 } };
      case (?existing) { existing };
    };

    let newCount = {
      treats = currentCount.treats + (if (unlockTreats) { 1 } else { 0 });
      messages = currentCount.messages + (if (unlockMessages) { 1 } else { 0 });
      pictures = currentCount.pictures + (if (unlockPictures) { 1 } else { 0 });
    };

    unlockCounts.add(caller, newCount);
    newCount;
  };

  public query ({ caller }) func getUnlockedTreats() : async [SweetTreat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view unlocked treats");
    };

    let count = switch (unlockCounts.get(caller)) {
      case (null) { 0 };
      case (?existing) { existing.treats };
    };

    let array = sweetTreats.reverse().toArray();
    array.sliceToArray(0, count);
  };

  public query ({ caller }) func getUnlockedMessages() : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view unlocked messages");
    };

    let count = switch (unlockCounts.get(caller)) {
      case (null) { 0 };
      case (?existing) { existing.messages };
    };

    let array = messages.reverse().toArray();
    array.sliceToArray(0, count);
  };

  public query ({ caller }) func getUnlockedPictures() : async [Picture] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view unlocked pictures");
    };

    let count = switch (unlockCounts.get(caller)) {
      case (null) { 0 };
      case (?existing) { existing.pictures };
    };

    let array = pictures.reverse().toArray();
    array.sliceToArray(0, count);
  };

  public query ({ caller }) func getAllTreats() : async [SweetTreat] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can view all treats");
    };
    sweetTreats.toArray();
  };

  // New endpoints for admin-only full data access
  public query ({ caller }) func getAllPictures() : async [Picture] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can view all pictures");
    };
    pictures.toArray();
  };

  public query ({ caller }) func getAllMessages() : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only the owner can view all messages");
    };
    messages.toArray();
  };
};
