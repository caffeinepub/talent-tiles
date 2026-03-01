import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module Category {
    public type Type = {
      #art;
      #food;
      #fashion;
      #crafts;
      #music;
      #wellness;
    };

    public func compare(cat1 : Type, cat2 : Type) : Order.Order {
      switch (cat1, cat2) {
        case (#art, #art) { #equal };
        case (#art, _) { #less };
        case (#food, #art) { #greater };
        case (#food, #food) { #equal };
        case (#food, _) { #less };
        case (#fashion, #art or #food) { #greater };
        case (#fashion, #fashion) { #equal };
        case (#fashion, _) { #less };
        case (#crafts, #music or #wellness) { #less };
        case (#crafts, #crafts) { #equal };
        case (#music, #wellness) { #less };
        case (#music, #music) { #equal };
        case (#wellness, #wellness) { #equal };
      };
    };
  };

  module DistanceLabel {
    public type Type = { #hyperlocal; #neighborhood; #cityWide };

    public func compare(dist1 : Type, dist2 : Type) : Order.Order {
      switch (dist1, dist2) {
        case (#hyperlocal, #hyperlocal) { #equal };
        case (#hyperlocal, _) { #less };
        case (#neighborhood, #hyperlocal) { #greater };
        case (#neighborhood, #neighborhood) { #equal };
        case (#neighborhood, #cityWide) { #less };
        case (#cityWide, #cityWide) { #equal };
      };
    };
  };

  type CreatorProfile = {
    id : Nat;
    name : Text;
    category : Category.Type;
    distanceLabel : DistanceLabel.Type;
    bio : Text;
    avatarUrl : Text;
  };

  module CreatorProfile {
    public func compareByName(c1 : CreatorProfile, c2 : CreatorProfile) : Order.Order {
      c1.name.compare(c2.name);
    };

    public func compareByCategory(c1 : CreatorProfile, c2 : CreatorProfile) : Order.Order {
      switch (Category.compare(c1.category, c2.category)) {
        case (#equal) { c1.name.compare(c2.name) };
        case (order) { order };
      };
    };

    public func compareByDistanceLabel(c1 : CreatorProfile, c2 : CreatorProfile) : Order.Order {
      switch (DistanceLabel.compare(c1.distanceLabel, c2.distanceLabel)) {
        case (#equal) {
          switch (Category.compare(c1.category, c2.category)) {
            case (#equal) { c1.name.compare(c2.name) };
            case (order) { order };
          };
        };
        case (order) { order };
      };
    };
  };

  var nextId = 13;

  let creators = Map.fromIter<Nat, CreatorProfile>(
    [
      (
        1,
        {
          id = 1;
          name = "Emily's Art Studio";
          category = #art;
          distanceLabel = #cityWide;
          bio = "Professional artist offering classes and custom paintings.";
          avatarUrl = "<https://cdn.example/sat1s1.jpg>";
        },
      ),
      (
        2,
        {
          id = 2;
          name = "Gourmet Bites Food Truck";
          category = #food;
          distanceLabel = #cityWide;
          bio = "Delicious street food using local ingredients.";
          avatarUrl = "<https://cdn.example/sat1s2.jpg>";
        },
      ),
      (
        3,
        {
          id = 3;
          name = "Urban Seamstress";
          category = #fashion;
          distanceLabel = #neighborhood;
          bio = "Custom clothing design and alterations.";
          avatarUrl = "<https://cdn.example/sat1s3.jpg>";
        },
      ),
      (
        4,
        {
          id = 4;
          name = "Crafty Corner";
          category = #crafts;
          distanceLabel = #hyperlocal;
          bio = "Handmade jewelry and pottery studio.";
          avatarUrl = "<https://cdn.example/sat1s4.jpg>";
        },
      ),
      (
        5,
        {
          id = 5;
          name = "Wellness Waves Yoga";
          category = #wellness;
          distanceLabel = #neighborhood;
          bio = "Online and in-person yoga classes for all levels.";
          avatarUrl = "<https://cdn.example/sat1s5.jpg>";
        },
      ),
      (
        6,
        {
          id = 6;
          name = "Guitar Guru";
          category = #music;
          distanceLabel = #cityWide;
          bio = "Virtual and in-home guitar lessons for kids and adults.";
          avatarUrl = "<https://cdn.example/sat1s6.jpg>";
        },
      ),
      (
        7,
        {
          id = 7;
          name = "Abstract Visions";
          category = #art;
          distanceLabel = #neighborhood;
          bio = "Digital artist specializing in mixed media works.";
          avatarUrl = "<https://cdn.example/sat1s7.jpg>";
        },
      ),
      (
        8,
        {
          id = 8;
          name = "Sweet Treats Bakery";
          category = #food;
          distanceLabel = #hyperlocal;
          bio = "Custom cakes and pastries for events and special occasions.";
          avatarUrl = "<https://cdn.example/sat1s8.jpg>";
        },
      ),
      (
        9,
        {
          id = 9;
          name = "Men's Fashion Loft";
          category = #fashion;
          distanceLabel = #cityWide;
          bio = "Bespoke tailoring and personal styling services.";
          avatarUrl = "<https://cdn.example/sat1s9.jpg>";
        },
      ),
      (
        10,
        {
          id = 10;
          name = "Papercraft Studio";
          category = #crafts;
          distanceLabel = #neighborhood;
          bio = "Workshops for card making, origami, and scrapbookers.";
          avatarUrl = "<https://cdn.example/sat1s10.jpg>";
        },
      ),
      (
        11,
        {
          id = 11;
          name = "Zumba with Jenny";
          category = #wellness;
          distanceLabel = #hyperlocal;
          bio = "Dance fitness classes for adults and kids.";
          avatarUrl = "<https://cdn.example/sat1s11.jpg>";
        },
      ),
      (
        12,
        {
          id = 12;
          name = "Soulful Strings";
          category = #music;
          distanceLabel = #neighborhood;
          bio = "Classical violinist available for events and lessons.";
          avatarUrl = "<https://cdn.example/sat1s12.jpg>";
        },
      ),
    ].values(),
  );

  public query ({ caller }) func getAllCreators() : async [CreatorProfile] {
    creators.values().toArray().sort(CreatorProfile.compareByName);
  };

  public query ({ caller }) func getCreatorsByCategory(category : Category.Type) : async [CreatorProfile] {
    let filtered = creators.values().filter(func(creator) { creator.category == category });
    filtered.toArray().sort(CreatorProfile.compareByName);
  };

  public query ({ caller }) func getCreatorsByDistanceLabel(distanceLabel : DistanceLabel.Type) : async [CreatorProfile] {
    let filtered = creators.values().filter(func(creator) { creator.distanceLabel == distanceLabel });
    filtered.toArray().sort(CreatorProfile.compareByCategory);
  };

  public shared ({ caller }) func addCreator(creator : CreatorProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add creators");
    };
    let newCreator : CreatorProfile = {
      id = nextId;
      name = creator.name;
      category = creator.category;
      distanceLabel = creator.distanceLabel;
      bio = creator.bio;
      avatarUrl = creator.avatarUrl;
    };
    creators.add(nextId, newCreator);
    nextId += 1;
  };
};
