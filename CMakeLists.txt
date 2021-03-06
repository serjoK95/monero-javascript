cmake_minimum_required(VERSION 3.4.1)

project(monero-javascript-wasm)

SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

#find_package(Threads)
#find_package(Backtrace)

add_definitions(-DAUTO_INITIALIZE_EASYLOGGINGPP)

##############
# C++ bridge
##############

include_directories("src/cpp")

#####################
# monero-cpp-library
#####################

set(MONERO_CPP "external/monero-cpp-library")
set(MONERO_CPP_SRC "${MONERO_CPP}/src")

# headers
include_directories("${MONERO_CPP_SRC}")
include_directories("${MONERO_CPP}/external/libsodium/include")
include_directories("${MONERO_CPP}/external/libsodium/include/sodium")

##################
# monero-project
##################

set(MONERO_CORE "${MONERO_CPP}/external/monero-core")
set(MONERO_CORE_SRC "${MONERO_CORE}/src")

# headers
include_directories("${MONERO_CORE_SRC}/")
#include_directories("${MONERO_CORE_SRC}/checkpoints")
#include_directories("${MONERO_CORE_SRC}/common")
#include_directories("${MONERO_CORE_SRC}/crypto")
#include_directories("${MONERO_CORE_SRC}/crypto/crypto_ops_builder/include/")	# DISABLED?
#include_directories("${MONERO_CORE_SRC}/crypto/crypto_ops_builder/include/sodium")	# DISABLED?
include_directories("${MONERO_CORE_SRC}/cryptonote_basic")
#include_directories("${MONERO_CORE_SRC}/multisig")
#include_directories("${MONERO_CORE_SRC}/cryptonote_core")
#include_directories("${MONERO_CORE_SRC}/cryptonote_protocol")
#include_directories("${MONERO_CORE_SRC}/wallet")
#include_directories("${MONERO_CORE_SRC}/rpc")
#include_directories("${MONERO_CORE_SRC}/mnemonics")
include_directories("${MONERO_CORE}/external/")
include_directories("${MONERO_CORE}/external/easylogging++")
include_directories("${MONERO_CORE}/external/rapidjson/include")
#include_directories("${MONERO_CORE}/external/unbound/libunbound")
#include_directories("${MONERO_CORE}/external/db_drivers/liblmdb")
include_directories("${MONERO_CORE}/contrib/epee/include")
#include_directories("${MONERO_CORE}/contrib/epee/include/net")

#include_directories("${CMAKE_CURRENT_BINARY_DIR}")
#include_directories("${MONERO_CORE_SRC}/wallet/api")

include_directories("${MONERO_CORE}/build/release/translations")

#############
# MyMonero
#############

#set(MYMONERO_JS "external/mymonero-core-js")
#set(MYMONERO_JS_SRC "${MYMONERO_JS}/src")
#set(MYMONERO_CPP "${MYMONERO_JS_SRC}/submodules/mymonero-core-cpp")
#set(MYMONERO_CPP_SRC "${MYMONERO_CPP}/src")
#set(MYMONERO_CORE "${MYMONERO_CPP}/contrib/monero-core-custom")
#set(MYMONERO_CORE_SRC "${MYMONERO_CORE}/src")

#include_directories("${MYMONERO_JS_SRC}")
#include_directories("${MYMONERO_CPP_SRC}")

#############
# Boost
#############

set(BOOST ${CMAKE_SOURCE_DIR}/build/boost)
include_directories("${BOOST}")
include_directories("${BOOST}/include") # must exist already - run bin/build-boost-emscripten.sh

add_library(boost_chrono STATIC IMPORTED)
set_target_properties(
    boost_chrono PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_chrono.a
)

add_library(boost_system STATIC IMPORTED)
set_target_properties(
    boost_system PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_system.a
)

add_library(boost_thread STATIC IMPORTED)
set_target_properties(
    boost_thread PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_thread.a
)

add_library(boost_serialization STATIC IMPORTED)
set_target_properties(
    boost_serialization PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_serialization.a
)

add_library(boost_filesystem STATIC IMPORTED)
set_target_properties(
    boost_filesystem PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_filesystem.a
)

add_library(boost_regex STATIC IMPORTED)
set_target_properties(
    boost_regex PROPERTIES IMPORTED_LOCATION
    ${BOOST}/lib/libboost_regex.a
)

#add_library(boost_atomic STATIC IMPORTED)
#set_target_properties(
    #boost_atomic PROPERTIES IMPORTED_LOCATION
    #${BOOST}/lib/libboost_atomic.a
#)

####################
# Source files
####################

set(
    SRC_FILES
    
    # monero-javascript WASM bridge
    src/main/cpp/index.cpp
    src/main/cpp/monero_wasm_bridge.cpp
    
    # monero-cpp-library (modified for WASM)
    ${MONERO_CPP_SRC}/utils/monero_utils.cpp
    ${MONERO_CPP_SRC}/daemon/monero_daemon_model.cpp
    ${MONERO_CPP_SRC}/wallet/monero_wallet_model.cpp
    ${MONERO_CPP_SRC}/wallet/monero_wallet_keys.cpp
    ${MONERO_CPP}/external/libsodium/src/crypto_verify/verify.c
    
    # monero-project (modified for WASM)
    ${MONERO_CORE_SRC}/cryptonote_basic/cryptonote_basic_impl.cpp
    ${MONERO_CORE_SRC}/cryptonote_basic/account.cpp
    ${MONERO_CORE_SRC}/cryptonote_basic/cryptonote_format_utils.cpp
    ${MONERO_CORE_SRC}/crypto/crypto.cpp
    ${MONERO_CORE_SRC}/crypto/hash.c
    ${MONERO_CORE_SRC}/crypto/slow-hash.c
    #${MONERO_CORE_SRC}/crypto/slow-hash-dummied.cpp
    ${MONERO_CORE_SRC}/crypto/oaes_lib.c
    ${MONERO_CORE_SRC}/crypto/crypto-ops.c
    ${MONERO_CORE_SRC}/crypto/crypto-ops-data.c
    ${MONERO_CORE_SRC}/crypto/keccak.c
    ${MONERO_CORE_SRC}/crypto/chacha.c
    ${MONERO_CORE_SRC}/crypto/random.c
    ${MONERO_CORE_SRC}/crypto/aesb.c
    ${MONERO_CORE_SRC}/crypto/tree-hash.c
    ${MONERO_CORE_SRC}/crypto/hash-extra-blake.c
    ${MONERO_CORE_SRC}/crypto/blake256.c
    ${MONERO_CORE_SRC}/crypto/hash-extra-groestl.c
    ${MONERO_CORE_SRC}/crypto/hash-extra-jh.c
    ${MONERO_CORE_SRC}/crypto/hash-extra-skein.c
    ${MONERO_CORE_SRC}/crypto/groestl.c
    ${MONERO_CORE_SRC}/crypto/jh.c
    ${MONERO_CORE_SRC}/crypto/skein.c
    ${MONERO_CORE_SRC}/cryptonote_core/cryptonote_tx_utils.cpp
    ${MONERO_CORE}/contrib/epee/src/hex.cpp
    ${MONERO_CORE}/contrib/epee/src/string_tools.cpp
    ${MONERO_CORE}/contrib/epee/src/memwipe.c
    ${MONERO_CORE}/contrib/epee/src/mlocker.cpp
    ${MONERO_CORE}/contrib/epee/src/wipeable_string.cpp
    ${MONERO_CORE_SRC}/common/base58.cpp
    ${MONERO_CORE_SRC}/device/device.cpp
    ${MONERO_CORE_SRC}/device/device_default.cpp
    ${MONERO_CORE_SRC}/multisig/multisig.cpp
    ${MONERO_CORE_SRC}/ringct/rctOps.cpp
    ${MONERO_CORE_SRC}/ringct/rctTypes.cpp
    ${MONERO_CORE_SRC}/ringct/rctCryptoOps.c
    ${MONERO_CORE_SRC}/ringct/rctSigs.cpp
    ${MONERO_CORE_SRC}/ringct/bulletproofs.cc
    ${MONERO_CORE_SRC}/ringct/multiexp.cc
    ${MONERO_CORE_SRC}/mnemonics/electrum-words.cpp
    ${MONERO_CORE}/external/easylogging++/easylogging++.cc
)

####################
# Build parameters
####################
set (
    EMCC_LINKER_FLAGS___BASE
    #unsure if the -I...boost..include is necessary here due to include above
    #
    # TODO? does EXPORT_NAME need to be the same for both targets? (or should it be set per-target with …_WASM, …_ASMJS?)
    "-Wall -std=c++11 \
--bind -s MODULARIZE=1 \
-Oz \
-s 'EXPORT_NAME=\"monero_javascript\"' \
--llvm-lto 1 \
-s ERROR_ON_UNDEFINED_SYMBOLS=0 \
-s ASSERTIONS=2 \
-s EXIT_RUNTIME=0 \
-s PRECISE_F32=1 \
-s DISABLE_EXCEPTION_CATCHING=0 \
-s EXCEPTION_DEBUG=1 \
-s DEMANGLE_SUPPORT=1 \
-s NO_DYNAMIC_EXECUTION=1 \
-s NODEJS_CATCH_EXIT=0 \
-s EXTRA_EXPORTED_RUNTIME_METHODS='[\"UTF8ToString\",\"stringToUTF8\",\"lengthBytesUTF8\",\"intArrayToString\",\"makeBigInt\",\"getTempRet0\"]' \
"
    # • Disabling exception catching does not introduce silent failures 
    # • Probably don't need PRECISE_F32 but wouldn't want to not use it
    #
    #
    # -s SAFE_HEAP=1 \
    # -g \
)
set(
    EMCC_LINKER_FLAGS__ASMJS
    "${EMCC_LINKER_FLAGS___BASE} \
-s WASM=0 \
-Os \
--separate-asm \
-s AGGRESSIVE_VARIABLE_ELIMINATION=1 \
-s ALLOW_MEMORY_GROWTH=0 \
--memory-init-file 0 \
"
    # --memory-init-file is explicitly set to 0 because optimization level is Oz, and some clients like React Native have trouble loading .mem files
    # .... it also didn't seem to have a giant impact on perf. but this should be tested again
    #
    # --closure 1 \
)
set(
    EMCC_LINKER_FLAGS__WASM
    "${EMCC_LINKER_FLAGS___BASE} \
-s WASM=1 \
-s ALLOW_MEMORY_GROWTH=1 \
--post-js ${CMAKE_CURRENT_LIST_DIR}/src/main/js/module-post.js \
"
    # -g \
)
#
#    -s EXPORTED_FUNCTIONS='[\"_sc_reduce\", \"_sc_reduce32\", \"_sc_check\", \"_sc_add\", \"_ge_fromfe_frombytes_vartime\", \"_ge_mul8\", \"_ge_p1p1_to_p3\", \"_ge_p3_tobytes\", \"_ge_scalarmult\", \"_ge_tobytes\", \"_sc_sub\", \"_sc_mulsub\", \"_ge_scalarmult_base\", \"_sc_0\", \"_ge_double_scalarmult_base_vartime\", \"_ge_double_scalarmult_precomp_vartime\", \"_ge_frombytes_vartime\", \"_ge_dsm_precomp\"]' \
#
#
message(STATUS "EMCC_LINKER_FLAGS__WASM ${EMCC_LINKER_FLAGS__WASM}")
message(STATUS "EMCC_LINKER_FLAGS__ASMJS ${EMCC_LINKER_FLAGS__ASMJS}")
#

#add_library(ssl STATIC IMPORTED)
#set_target_properties(ssl PROPERTIES IMPORTED_LOCATION
#    ${MONERO_CORE}/external-libs/openssl/libssl.a)

####################
# Build targets
####################

# WASM
add_executable(monero-javascript ${SRC_FILES})
set_target_properties(monero-javascript PROPERTIES LINK_FLAGS "${EMCC_LINKER_FLAGS__WASM}")
target_link_libraries(
    monero-javascript
    #
    boost_chrono
    boost_system
    boost_thread
    #boost_serialization
    #boost_filesystem
    #boost_regex
    #boost_atomic
    #
    ${log-lib}
)

# ASMJS
#add_executable(monero-javascript_ASMJS ${SRC_FILES})
#set_target_properties(monero-javascript_ASMJS PROPERTIES LINK_FLAGS "${EMCC_LINKER_FLAGS__ASMJS}")
#target_link_libraries(
	#monero-javascript_ASMJS
    ##
    #${log-lib}
#)

# build to bitcode instead of wasm
#SET(CMAKE_EXECUTABLE_SUFFIX ".bc")	